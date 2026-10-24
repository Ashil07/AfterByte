import { Approach } from "@/components/chapters/Approach";
import { Contact } from "@/components/chapters/contact/Contact";
import { Friction } from "@/components/chapters/friction/Friction";
import { OptionalChapter } from "@/components/chapters/OptionalChapter";
import { Opening } from "@/components/chapters/Opening";
import { Services } from "@/components/chapters/Services";
import { Vision } from "@/components/chapters/Vision";
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
      {isChapterEnabled("turning-point") && <OptionalChapter id="turning-point" />}
      <Services />
      {isChapterEnabled("work") && <OptionalChapter id="work" />}
      {isChapterEnabled("team") && <OptionalChapter id="team" />}
      <Approach />
      <Contact />
    </>
  );
}
