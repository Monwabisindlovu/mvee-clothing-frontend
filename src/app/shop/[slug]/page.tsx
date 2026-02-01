import ShopProductClient from '@/components/store/ShopProductClient';

interface PageProps {
  params: {
    slug: string;
  };
}

export default function Page({ params }: PageProps) {
  return <ShopProductClient slug={params.slug} />;
}
