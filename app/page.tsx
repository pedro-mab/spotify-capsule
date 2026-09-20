import { CapsuleApp } from "@/components/CapsuleApp";
import { getValidAccessToken } from "@/lib/auth";

type HomeProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function Home({ searchParams }: HomeProps) {
  const accessToken = await getValidAccessToken();
  const params = await searchParams;

  return (
    <div className="flex min-h-full flex-1 items-center justify-center bg-[#0a0a0a] px-4 py-16">
      <CapsuleApp
        isAuthenticated={!!accessToken}
        error={params.error ?? null}
      />
    </div>
  );
}
