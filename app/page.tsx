import Image from 'next/image';
import IncidentForm from './components/IncidentForm';

export default function Home() {
  return (
    <div className='flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black'>
      <h1 className='text-3xl font-bold text-zinc-900 dark:text-zinc-50'>
        Report Form
      </h1>

      <IncidentForm />
    </div>
  );
}
