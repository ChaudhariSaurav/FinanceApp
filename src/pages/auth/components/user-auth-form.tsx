import { HTMLAttributes, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/custom/button';
import { PasswordInput } from '@/components/custom/password-input';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';
import { userLogin } from '../service/auth';
import { FirebaseError } from 'firebase/app';

// Define schema for form validation
const formSchema = z.object({
  email: z.string()
    .min(1, { message: 'Please enter your email address' })
    .email({ message: 'Invalid email address' }),
  password: z.string()
    .min(7, { message: 'Password must be at least 7 characters long' }),
});

// Define user interface for TypeScript
interface AppUser {
  id: string;
  displayName: string;
  email: string;
}

type LoginResult = AppUser | string;

// Props for the UserAuthForm component
interface UserAuthFormProps extends HTMLAttributes<HTMLDivElement> {}

// UserAuthForm component
export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
 
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Handle form submission
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      const result = await userLogin(data.email, data.password) as unknown as LoginResult;

      if (typeof result === 'string') {
        throw new Error(result); // Use the error message from result
      }

      toast({
        title: `Welcome, ${result.displayName || 'User'}!`,
        description: 'Login Successful',
        variant: 'default',
      });
      navigate('/dashboard');
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Centralized error handling
  const handleError = (error: unknown) => {
    console.error('Login failed:', error);
    let message: string;

    if (error instanceof FirebaseError) {
      message = error.message;
    } else if (error instanceof Error) {
      message = error.message;
    } else {
      message = 'Please try again later.';
    }

    toast({
      title: 'Uh oh! Something went wrong.',
      description: message,
      variant: 'destructive',
    });
  };

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
          <div className='grid gap-2'>
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder='name@example.com' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <div className='flex items-center justify-between'>
                    <FormLabel>Password</FormLabel>
                    <Link
                      to='/forgot-password'
                      className='text-sm font-medium text-muted-foreground hover:opacity-75'
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <FormControl>
                    <PasswordInput placeholder='********' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className='mt-2' loading={isLoading}>
              Login
            </Button>

            <div className='relative my-2'>
              <div className='absolute inset-0 flex items-center'>
                <span className='w-full border-t' />
              </div>
              <div className='relative flex justify-center text-xs uppercase'>
                <span className='bg-background px-2 text-muted-foreground'>
                  Or continue with
                </span>
              </div>
            </div>

            {/* Additional authentication options can be added here */}
          </div>
        </form>
      </Form>
    </div>
  );
}
