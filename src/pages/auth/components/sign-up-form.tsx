import { HTMLAttributes, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/custom/button'
import { PasswordInput } from '@/components/custom/password-input'
import { cn } from '@/lib/utils'
import { registerUser } from '../service/auth' // Adjust the import path
import { useToast } from '@/components/ui/use-toast'
import { Combobox } from '@/components/ui/Combobox'
import { ToastAction } from '@/components/ui/toast'

const formSchema = z
  .object({
    firstName: z.string().min(1, { message: 'Please enter your first name' }),
    lastName: z.string().min(1, { message: 'Please enter your last name' }),
    email: z
      .string()
      .min(1, { message: 'Please enter your email' })
      .email({ message: 'Invalid email address' }),
    mobile: z
      .string()
      .min(1, { message: 'Please enter your mobile number' })
      .regex(/^[0-9]+$/, { message: 'Invalid mobile number' }),
    dateOfBirth: z
      .string()
      .min(1, { message: 'Please enter your date of birth' })
      .refine(
        (value) => {
          const date = new Date(value)
          const age = new Date().getFullYear() - date.getFullYear()
          const isAdult =
            age > 18 ||
            (age === 18 &&
              new Date() >= new Date(date.setFullYear(date.getFullYear() + 18)))
          return isAdult
        },
        { message: 'You must be at least 18 years old.' }
      ),
    password: z
      .string()
      .min(7, { message: 'Password must be at least 7 characters' }),
    confirmPassword: z
      .string()
      .min(1, { message: 'Please confirm your password' }),
    photo: z.instanceof(File).nullable(),
    loanType: z.string().min(1, { message: 'Please select a loan type' }),
    totalEmiMonths: z
      .number()
      .min(1, { message: 'Total EMI months must be at least 1' })
      .max(360, { message: 'Total EMI months cannot exceed 360' }),
    loanValue: z
      .number()
      .min(1, { message: 'Loan value must be greater than 0' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ['confirmPassword'],
  })

interface SignUpFormProps extends HTMLAttributes<HTMLDivElement> {}

export function SignUpForm({ className, ...props }: SignUpFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      mobile: '',
      dateOfBirth: '',
      password: '',
      confirmPassword: '',
      photo: null,
      loanType: '', // Default to empty string
      totalEmiMonths: 12, // Default value
      loanValue: 1000, // Default loan value
    },
  })

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true)
    try {
      const { customerId } = await registerUser(
        data.email,
        data.password,
        data.firstName,
        data.lastName,
        data.dateOfBirth,
        data.mobile,
        data.photo,
        data.loanType,
        data.totalEmiMonths,
        data.loanValue
      )

      toast({
        title: 'Thank you for Registration!',
        description: `${customerId} registered successfully!`,
        variant: 'default',
        action: (
          <ToastAction
            altText='Copy Customer ID'
            onClick={() => {
              navigator.clipboard.writeText(customerId)
              toast({
                title: 'Copied!',
                description: 'Customer ID has been copied to your clipboard.',
              })
            }}
          >
            Copy Customer ID
          </ToastAction>
        ),
      })
      form.reset() // Reset the form
    } catch (error: any) {
      console.error('Registration failed:', error)
      toast({
        title: 'Uh oh! Something went wrong.',
        description: error.message || 'Registration failed. Please try again.',
        variant: 'destructive',
      })
      form.reset() // Reset the form on error as well
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
            {/* First Name */}
            <FormField
              control={form.control}
              name='firstName'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder='First Name' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Last Name */}
            <FormField
              control={form.control}
              name='lastName'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder='Last Name' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Email */}
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder='name@example.com' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Date of Birth */}
            <FormField
              control={form.control}
              name='dateOfBirth'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date of Birth</FormLabel>
                  <FormControl>
                    <Input type='date' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Mobile */}
            <FormField
              control={form.control}
              name='mobile'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mobile</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Mobile Number'
                      {...field}
                      maxLength={10}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Photo Input */}
            <FormField
              control={form.control}
              name='photo'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Profile Picture</FormLabel>
                  <FormControl>
                    <input
                      type='file'
                      className='border-1 w-full rounded-md border p-2'
                      onChange={(e) =>
                        field.onChange(e.target.files?.[0] || null)
                      }
                      accept='image/*'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Loan Type */}
            <FormField
              control={form.control}
              name='loanType'
              render={() => (
                <FormItem>
                  <FormLabel>Loan Type</FormLabel>
                  <FormControl>
                    <Combobox
                      value={form.watch('loanType')}
                      onSelect={(selectedValue) =>
                        form.setValue('loanType', selectedValue)
                      }
                      placeholder='Select loan type'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Total EMI Months */}
            <FormField
              control={form.control}
              name='totalEmiMonths'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total EMI Months</FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      placeholder='Total EMI Months'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Password */}
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <PasswordInput placeholder='********' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Confirm Password */}
            <FormField
              control={form.control}
              name='confirmPassword'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <PasswordInput placeholder='********' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button className='mt-4 w-full' loading={isLoading}>
            Create Account
          </Button>
        </form>
      </Form>
    </div>
  )
}
