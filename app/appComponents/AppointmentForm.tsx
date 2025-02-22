import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import InputMask from 'react-input-mask';
import { ErrorBoundary } from 'react-error-boundary';
import { ReloadIcon } from "@radix-ui/react-icons"; 

/*
   Define a data structure for the appointment using Zod.
  - The `appointmentSchema` defines the structure and validation rules for the form data.
  - It ensures all fields are required, validates email format, phone format, and ensures the date is not in the past.
*/
const appointmentSchema = z.object({
  patientName: z.string().min(1, { message: 'Patient name is required' }),
  email: z.string().email({ message: 'Invalid email address' }),
  phone: z.string().min(10, { message: 'Phone number must be at least 10 digits' })
    .refine((value) => /^\d{10}$/.test(value.replace(/\D/g, '')), { message: 'Invalid phone number' }),
  appointmentType: z.enum(['CHECKUP', 'FOLLOWUP']),
  preferredDate: z.string().min(1, { message: 'Preferred date is required' })
    .refine((date) => new Date(date) >= new Date(), { message: 'Date cannot be in the past' }),
  reasonForVisit: z.string().min(1, { message: 'Reason for visit is required' }),
});

type Appointment = z.infer<typeof appointmentSchema>;

/*
   Implemented error boundaries.
  - The ErrorFallback component is used to display unexpected errors in the form.
  - It provides a user-friendly error message if something goes wrong.
*/
function ErrorFallback({ error }: { error: Error }) {
  return (
    <div role="alert" className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
    </div>
  );
}

export default function AppointmentForm() {
  /*
     Use React Hook Form with Zod validation.
    - The `useForm` hook is configured with Zod resolver for validation.
    - It handles form state, validation errors, and submission.
  */
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset, // Added reset function from React Hook Form
  } = useForm<Appointment>({
    resolver: zodResolver(appointmentSchema),
  });

  /*
    Handle form submission.
    - The `onSubmit` function simulates a network request (e.g., API call).
    - It shows a loading state during submission and resets the form after successful submission.
  */
  const onSubmit = async (data: Appointment) => {
    // Simulate a network request (e.g., API call) to perform the loading state. 
    console.log("Form submitted:", data);
    await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate a 2-second delay for the spinner icon to spin. 
    alert("Appointment booked successfully!");

    // Reset the form fields after submission
    reset();
  };

  return (
    /*
      Implemented error boundaries.
      - The ErrorBoundary component wraps the form to catch and display unexpected errors.
    */
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full bg-white border border-gray-300 p-6 shadow-lg rounded-xl space-y-6"
      >
        <div className="grid grid-cols-1 gap-6">
          {/* 
            Implemented form fields for all required data.
            - Each field is registered with `react-hook-form` and includes validation.
            - Validation errors are displayed clearly below each field.
          */}

          {/* Patient Name */}
          <div>
            <Label>Patient Name</Label>
            <Input {...register('patientName')} placeholder="Enter your full name" className="form-field" />
            {errors.patientName && <p className="text-red-500 text-sm">{errors.patientName.message}</p>}
          </div>

          {/* Email */}
          <div>
            <Label>Email</Label>
            <Input {...register('email')} placeholder="Enter your email" className="form-field" />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>

          {/* 
             Added field masking for phone numbers.
            - The `InputMask` component is used to format the phone number input.
          */}
          <div>
            <Label>Phone</Label>
            <InputMask
              mask="(999) 999-9999"
              {...register('phone')}
            >
              {(inputProps: any) => <Input {...inputProps} placeholder="Enter your phone number" className="form-field" />}
            </InputMask>
            {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
          </div>

          {/* Appointment Type */}
          <div>
            <Label>Appointment Type</Label>
            <select {...register("appointmentType")} className="select-field">
              <option value="CHECKUP">Checkup</option>
              <option value="FOLLOWUP">Follow-up</option>
            </select>
            {errors.appointmentType && <p className="text-red-500 text-sm">{errors.appointmentType.message}</p>}
          </div>

          {/* Preferred Date */}
          <div>
            <Label>Preferred Date</Label>
            <Input type="date" {...register('preferredDate')} className="form-field" />
            {errors.preferredDate && <p className="text-red-500 text-sm">{errors.preferredDate.message}</p>}
          </div>

          {/* Reason for Visit */}
          <div>
            <Label>Reason for Visit</Label>
            <Textarea {...register("reasonForVisit")} placeholder="Briefly explain the reason for your visit" className="form-field" />
            {errors.reasonForVisit && <p className="text-red-500 text-sm">{errors.reasonForVisit.message}</p>}
          </div>

          {/* 
             Show loading state during submission.
            - The submit button displays a spinner and is disabled during submission.
          */}
          <Button
            className="button-primary w-full sm:w-auto"
            type="submit"
            disabled={isSubmitting} // Disable the button during submission
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <ReloadIcon className="animate-spin" /> {/* Spinner icon */}
                Submitting...
              </div>
            ) : (
              'Submit'
            )}
          </Button>
        </div>
      </form>
    </ErrorBoundary>
  );
}