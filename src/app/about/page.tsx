import { Metadata } from "next";
import { getHeroSection, getMission, getTeamMembers, getCoreValues } from "@/lib/contentful";
import { PageHero } from "@/components/sections/PageHero";
import { Mission } from "@/components/sections/Mission";
import { Team } from "@/components/sections/Team";
import { CoreValues } from "@/components/sections/CoreValues";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about Ateed Tech - your dedicated technology partner committed to bringing your unique visions to life through custom software development.",
};

export const dynamic = "force-static";
export const revalidate = 3600;

export default async function AboutPage() {
  const [heroData, missionData, teamData, valuesData] = await Promise.all([
    getHeroSection("AboutUs"),
    getMission("About"),
    getTeamMembers(),
    getCoreValues(),
  ]);

  const hero = heroData[0] as any;
  const heroImageUrl = hero?.fields?.heroImage?.fields?.file?.url as string | undefined;
  const backgroundImage = heroImageUrl
    ? heroImageUrl.startsWith("//")
      ? `https:${heroImageUrl}`
      : heroImageUrl
    : undefined;

  return (
    <>
      <PageHero
        heading={(hero?.fields?.heading as string) || "About Us"}
        description={(hero?.fields?.description as string) || "Learn more about Ateed Tech"}
        backgroundImage={backgroundImage}
      />

      {missionData[0] && <Mission data={missionData[0] as any} />}

      {valuesData && valuesData.length > 0 && <CoreValues data={valuesData as any} />}

      {teamData && teamData.length > 0 && <Team data={teamData as any} />}
    </>
  );
}
