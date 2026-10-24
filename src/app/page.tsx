import { Approach } from "@/components/chapters/Approach";
import { Contact } from "@/components/chapters/contact/Contact";
import { Friction } from "@/components/chapters/friction/Friction";
import { Opening } from "@/components/chapters/Opening";
import { Services } from "@/components/chapters/Services";
import { Team } from "@/components/chapters/Team";
import { TurningPoint } from "@/components/chapters/TurningPoint";
import { Vision } from "@/components/chapters/Vision";
import { Work } from "@/components/chapters/Work";
import { isChapterEnabled } from "@/content/chapters";

/**
 * The story, in order. See CLAUDE.md §2 for what each chapter is for.
 * Turning point, Work and Team render only when enabled in src/content/chapters.ts.
 */
export default function Home() {
  return (
    <>
      <Opening />
      <Vision />
      <Friction />
      {isChapterEnabled("turning-point") && <TurningPoint />}
      <Services />
      {isChapterEnabled("work") && <Work />}
      {isChapterEnabled("team") && <Team />}
      <Approach />
      <Contact />
    </>
  );
}
