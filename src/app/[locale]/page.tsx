import MultiStepForm from '@/components/MultiStepForm';
import {routing} from '@/i18n/routing';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export default function Home() {
  return (
    <main className="flex min-h-[100dvh] flex-col items-center justify-center bg-gray-50">
      <MultiStepForm />
    </main>
  );
}