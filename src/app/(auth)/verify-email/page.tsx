import VerifyEmailForm from '@/components/modules/Auth/verifyEmailForm';
import { redirect } from 'next/navigation';

interface VerifyEmailParams {
    searchParams: Promise<{ email?: string }>;
}

const VerifyEmailPage = async ({ searchParams }: VerifyEmailParams) => {
    const params = await searchParams;
    const email = params.email;

    if (!email) {
        redirect('/signin');
    }

    return <VerifyEmailForm email={email} />;
};

export default VerifyEmailPage;
