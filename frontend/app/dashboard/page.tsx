'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AxiosError } from 'axios';
import API from '../../services/api';

interface Assignment {
  id?: string;
  title: string;
  description: string;
  dueDate: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchAssignments = async () => {
      try {
        const response = await API.get('/assignment');
        setAssignments(response.data);
      } catch (err) {
        const error = err as AxiosError<{ message?: string } | string>;
        const message = typeof error.response?.data === 'string'
          ? error.response.data
          : error.response?.data?.message || 'Failed to fetch assignments.';
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-8 bg-white p-4 rounded-lg shadow-sm">
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
          >
            Logout
          </button>
        </header>

        <main>
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Available Assignments</h2>
          {loading && <p className="text-gray-500">Loading assignments...</p>}
          {error && <p className="text-red-500 mb-4">{error}</p>}

          {!loading && assignments.length === 0 && !error && (
            <p className="text-gray-500">No assignments created yet.</p>
          )}

          <div className="grid gap-4">
            {assignments.map((item, index) => (
              <div key={item.id || index} className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-bold text-gray-800">{item.title}</h3>
                <p className="text-gray-600 mt-2">{item.description}</p>
                <div className="mt-4 text-sm text-gray-400">
                  Due: {new Date(item.dueDate).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}