import { redirect } from 'next/navigation';

export default function Home() {
    redirect('/media-page');
    return null; 
}