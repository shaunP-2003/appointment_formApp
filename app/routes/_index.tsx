import React from 'react';
import AppointmentForm from '../appComponents/AppointmentForm';

export default function Index() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4 sm:p-10">
      <div className="w-full max-w-2xl bg-white border border-gray-300 p-6 sm:p-10 rounded-xl shadow-xl">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-700 text-center mb-6">
          Appointment Request Form
        </h1>
        <AppointmentForm />
      </div>
    </div>
  );
}

