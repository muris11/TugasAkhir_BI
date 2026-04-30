import { notFound } from "next/navigation";
import { StakeholderPage } from "@/components/stakeholder-page";
import { stakeholderConfigs } from "@/lib/stakeholder-config";

export function generateStaticParams() {
  return stakeholderConfigs.map((item) => ({ slug: item.slug }));
}

export default async function StakeholderRoute({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const match = stakeholderConfigs.find((item) => item.slug === slug);

  if (!match) {
    notFound();
  }

  return <StakeholderPage slug={match.slug} />;
}
