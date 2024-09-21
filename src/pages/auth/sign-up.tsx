import { Card } from '@/components/ui/card';
import { SignUpForm } from './components/sign-up-form';
import { Link } from 'react-router-dom';

export default function SignUp() {
  return (
    <div className='container mx-auto flex h-screen flex-col items-center justify-center bg-primary-foreground px-4 lg:px-0'>
      <div className='flex w-full max-w-md flex-col justify-center space-y-2 lg:max-w-lg'>
  
        <Card className='p-6 w-full s:h-[750px] s:p-2 md:h-fit'>
          <div className='mb-2 flex flex-col space-y-2 text-left'>
            <h1 className='text-lg font-semibold tracking-tight'>Create an account</h1>
            <p className='text-sm text-muted-foreground'>
              Enter your email and password to create an account. <br />
              Already have an account?{' '}
              <Link
                to='/sign-in'
                className='underline underline-offset-4 hover:text-primary'
              >
                Sign In
              </Link>
            </p>
          </div>
       
            <SignUpForm />
        </Card>
      
      </div>
    </div>
  );
}
