import { Approach } from "@/components/chapters/Approach";
import { Contact } from "@/components/chapters/contact/Contact";
import { Friction } from "@/components/chapters/friction/Friction";
import { Opening } from "@/components/chapters/Opening";
import { Services } from "@/components/chapters/Services";
import { Team } from "@/components/chapters/Team";
import { TurningPoint } from "@/components/chapters/TurningPoint";
import { Vision } from "@/components/chapters/Vision";
import { Work } from "@/components/chapters/Work";

/** The story, in order. See CLAUDE.md §2 for what each chapter is for. */
export default function Home() {
  return (
    <>
      <Opening />
      <Vision />
      <Friction />
      <TurningPoint />
      <Services />
      <Work />
      <Team />
      <Approach />
      <Contact />
    </>
  );
}
