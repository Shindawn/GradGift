import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import grassBg from "@/assets/grass-bg.jpg";
import girl from "@/assets/girl.png";
import strawberryBasket from "@/assets/strawberry-basket.png";
import raspberryBasket from "@/assets/raspberry-basket.png";
import jamJar from "@/assets/jam-jar.png";
import cake from "@/assets/cake.png";
import cherries from "@/assets/cherries.png";
import envelope from "@/assets/envelope.png";
import plate from "@/assets/plate.png";
import camera from "@/assets/camera.png";
import graduatePhoto from "@/assets/graduate-photo.jpg";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Music2, VolumeX } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Congrats Graduate! Ma. Loureen Tiozon" },
      {
        name: "description",
        content:
          "A picnic-themed tribute for Ma. Loureen Tiozon, Cum Laude, University of Santo Tomas, Batch 2026.",
      },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Pinyon+Script&family=Playfair+Display:ital,wght@0,500;0,700;1,500&family=Inter:wght@400;600&display=swap",
      },
    ],
  }),
  component: Index,
});

function Gingham({ className = "", rotate = 0 }: { className?: string; rotate?: number }) {
  return (
    <div
      className={className}
      style={{
        transform: `rotate(${rotate}deg)`,
        backgroundImage:
          "linear-gradient(45deg, #c8324a 25%, transparent 25%, transparent 75%, #c8324a 75%), linear-gradient(45deg, #c8324a 25%, #fff 25%, #fff 75%, #c8324a 75%)",
        backgroundSize: "22px 22px",
        backgroundPosition: "0 0, 11px 11px",
        boxShadow: "0 14px 40px rgba(0,0,0,0.35)",
      }}
    />
  );
}

type ModalKey = "letter" | "pictorial" | "wishes" | "achievements" | null;

const MODAL_CONTENT: Record<
  Exclude<ModalKey, null>,
  { title: string; subtitle: string; body: React.ReactNode }
> = {
  letter: {
    title: "A Letter For You",
    subtitle: "From everyone who cheered you on",
    body: (
      <div className="space-y-3 text-sm leading-relaxed">
        <p>Dearest Loureen,</p>
        <p>
          From the very first day of UST, you carried this journey with so much heart.
          Every late night, every shared laugh, every push toward that Cum Laude —
          it all mattered, and it all led here.
        </p>
        <p>
          Thank you for being the kind of person who makes a whole room feel
          lighter. We are endlessly proud of you. Keep blooming, Batch 2026.
        </p>
        <p className="italic text-berry-deep">— With love, lescy</p>
      </div>
    ),
  },
  pictorial: {
    title: "Pictorial",
    subtitle: "A moment worth keeping",
    body: (
      <div className="overflow-hidden rounded-md bg-cream/40 p-2">
        <img
          src={graduatePhoto}
          alt="Ma. Loureen Tiozon graduation portrait"
          className="h-auto w-full rounded-sm object-cover"
        />
        <p className="mt-3 text-center text-xs italic text-berry-deep">
          Ma. Loureen Tiozon · UST Batch 2026
        </p>
      </div>
    ),
  },
  wishes: {
    title: "Wishes",
    subtitle: "Sweet notes for the road ahead",
    body: (
      <ul className="space-y-3 text-sm">
        <li>🍓 May every season be kinder than the last.</li>
        <li>🎂 May your dreams rise gently, like cake in the oven.</li>
        <li>💌 May love always find your address.</li>
        <li>🌿 May you keep choosing yourself, again and again.</li>
      </ul>
    ),
  },
  achievements: {
    title: "Achievements Unlocked",
    subtitle: "A few of the things you've earned",
    body: (
      <ul className="space-y-3 text-sm">
        <li>🎓 Graduated — University of Santo Tomas, Batch 2026.</li>
        <li>🏆 Cum Laude — earned with grit and grace.</li>
        <li>⭐ Most consistent presence, in class and in life.</li>
        <li>💖 Beautiful (unofficial, but unanimous).</li>
      </ul>
    ),
  },
};

function Index() {
  const [open, setOpen] = useState<ModalKey>(null);
  const [musicOn, setMusicOn] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const videoId = "e2vyrIQTFqc";
  const iframeSrc = `https://www.youtube.com/embed/${videoId}?enablejsapi=1&autoplay=1&loop=1&playlist=${videoId}&mute=1&playsinline=1&controls=0&modestbranding=1`;

  // Floating motion via keyframes injected once
  useEffect(() => {
    const id = "picnic-anim-styles";
    if (document.getElementById(id)) return;
    const style = document.createElement("style");
    style.id = id;
    style.textContent = `
      @keyframes floaty { 0%,100%{transform:translateY(0) rotate(var(--r,0deg))} 50%{transform:translateY(-8px) rotate(calc(var(--r,0deg) + 2deg))} }
      @keyframes sway   { 0%,100%{transform:rotate(calc(var(--r,0deg) - 3deg))} 50%{transform:rotate(calc(var(--r,0deg) + 3deg))} }
      @keyframes wiggle { 0%,100%{transform:translateY(0) rotate(var(--r,0deg))} 50%{transform:translateY(-6px) rotate(calc(var(--r,0deg) - 4deg))} }
      @keyframes blanket-breathe { 0%,100%{transform:rotate(-4deg) scale(1)} 50%{transform:rotate(-4deg) scale(1.01)} }
      @keyframes shimmer { 0%,100%{filter:drop-shadow(0 0 0 rgba(255,220,120,0))} 50%{filter:drop-shadow(0 0 12px rgba(255,220,120,0.55))} }
      .anim-floaty  { animation: floaty 4.5s ease-in-out infinite; }
      .anim-sway    { animation: sway 5s ease-in-out infinite; transform-origin: 50% 100%; }
      .anim-wiggle  { animation: wiggle 3.8s ease-in-out infinite; }
      .anim-breathe { animation: blanket-breathe 7s ease-in-out infinite; }
      .anim-shimmer { animation: shimmer 3.2s ease-in-out infinite; }
      @keyframes fade-up { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
      .anim-fade-up { animation: fade-up .9s ease-out both; }
    `;
    document.head.appendChild(style);
  }, []);

  const toggleMusic = () => {
    setMusicOn((v) => {
      const next = !v;
      setTimeout(() => {
        const win = iframeRef.current?.contentWindow;
        if (!win) return;
        const command = next ? "playVideo" : "pauseVideo";
        win.postMessage(
          JSON.stringify({ event: "command", func: command, args: [] }),
          "*"
        );
        if (next) {
          win.postMessage(
            JSON.stringify({ event: "command", func: "unMute", args: [] }),
            "*"
          );
        } else {
          win.postMessage(
            JSON.stringify({ event: "command", func: "mute", args: [] }),
            "*"
          );
        }
      }, 100);
      return next;
    });
  };

  const clickable =
    "cursor-pointer transition-transform duration-200 hover:scale-110 hover:-rotate-2 focus:outline-none focus:ring-2 focus:ring-berry/60 rounded-full";

  return (
    <main
      className="relative min-h-screen w-full overflow-hidden"
      style={{
        backgroundImage: `url(${grassBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-grass-deep/10 mix-blend-multiply" />

      {/* Hidden YouTube player for the song */}
      <iframe
        ref={iframeRef}
        title="background-music"
        src={iframeSrc}
        allow="autoplay; encrypted-media; picture-in-picture"
        className="pointer-events-none absolute h-0 w-0 opacity-0"
      />

      {/* Music toggle */}
      <button
        type="button"
        onClick={toggleMusic}
        aria-label={musicOn ? "Pause music" : "Play music"}
        className="fixed right-4 top-4 z-40 flex items-center gap-2 rounded-full bg-cream/90 px-3 py-2 text-xs font-semibold text-berry-deep shadow-lg backdrop-blur transition hover:scale-105"
      >
        {musicOn ? <Music2 className="h-4 w-4 animate-pulse" /> : <VolumeX className="h-4 w-4" />}
        {musicOn ? "You're On Your Own, Kid" : "Play song"}
      </button>

      <section className="relative mx-auto flex min-h-screen w-full max-w-md flex-col items-center justify-center px-4 py-10">
        <div className="relative aspect-[3/4] w-full anim-fade-up">
          {/* Gingham picnic blanket */}
          <Gingham
            className="anim-breathe absolute left-1/2 top-1/2 h-[78%] w-[92%] -translate-x-1/2 -translate-y-1/2 rounded-sm"
          />

          {/* Certificate envelope back — centered */}
          <div
            className="absolute left-1/2 top-1/2 h-[58%] w-[80%] -translate-x-1/2 -translate-y-1/2 rounded-md"
            style={{
              boxShadow: "0 12px 30px rgba(0,0,0,0.25)",
              backgroundImage: "linear-gradient(135deg, #f4ead4 0%, #ece0c2 100%)",
            }}
          />

          {/* Certificate card — centered */}
          <div
            className="anim-shimmer absolute left-1/2 top-1/2 flex h-[56%] w-[74%] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center px-5 py-6 text-center"
            style={{
              background: "linear-gradient(180deg, #fbf3dc 0%, #f3e6bd 100%)",
              boxShadow: "0 18px 40px rgba(0,0,0,0.3), inset 0 0 0 2px #d9c79a",
              clipPath:
                "polygon(0% 4%, 2% 0%, 6% 4%, 10% 0%, 14% 4%, 18% 0%, 22% 4%, 26% 0%, 30% 4%, 34% 0%, 38% 4%, 42% 0%, 46% 4%, 50% 0%, 54% 4%, 58% 0%, 62% 4%, 66% 0%, 70% 4%, 74% 0%, 78% 4%, 82% 0%, 86% 4%, 90% 0%, 94% 4%, 98% 0%, 100% 4%, 100% 96%, 98% 100%, 94% 96%, 90% 100%, 86% 96%, 82% 100%, 78% 96%, 74% 100%, 70% 96%, 66% 100%, 62% 96%, 58% 100%, 54% 96%, 50% 100%, 46% 96%, 42% 100%, 38% 96%, 34% 100%, 30% 96%, 26% 100%, 22% 96%, 18% 100%, 14% 96%, 10% 100%, 6% 96%, 2% 100%, 0% 96%)",
            }}
          >
            <div className="font-[Playfair_Display] text-[1.45rem] leading-none text-berry-deep italic">
              Congratulation
            </div>
            <div className="-mt-1 flex items-center gap-2">
              <span
                style={{ fontFamily: "Pinyon Script, cursive" }}
                className="text-[1.9rem] leading-none text-berry"
              >
                Graduate!
              </span>
            </div>

            <div className="mt-2 text-[0.55rem] font-semibold tracking-[0.18em] text-berry-deep">
              UNIVERSITY OF SANTO TOMAS
            </div>

            <div
              className="mt-3 text-berry"
              style={{ fontFamily: "Pinyon Script, cursive", fontSize: "2rem", lineHeight: 0.95 }}
            >
              Ma. Loureen
            </div>
            <div
              className="text-berry"
              style={{ fontFamily: "Pinyon Script, cursive", fontSize: "2rem", lineHeight: 1 }}
            >
              Tiozon
            </div>

            <div className="mt-3 text-[0.6rem] font-semibold tracking-[0.14em] text-berry-deep">
              BS POLITICAL SCIENCE
            </div>

            <div className="mt-3 flex flex-col items-center">
              <span
                style={{ fontFamily: "Pinyon Script, cursive" }}
                className="text-xl text-berry-deep"
              >
                Cum Laude
              </span>
              <span className="text-[0.55rem] font-semibold tracking-[0.22em] text-berry-deep/80">
                BATCH 2026
              </span>
            </div>
          </div>

          {/* Person (bg removed) */}
          <img
            src={girl}
            alt="Honoree portrait"
            className="anim-sway pointer-events-none absolute -left-4 bottom-[2%] w-[44%] drop-shadow-2xl"
            style={{ ["--r" as never]: "0deg" }}
            loading="lazy"
          />

          {/* Interactive decorations */}
          <button
            type="button"
            onClick={() => setOpen("wishes")}
            aria-label="Open wishes"
            className={`${clickable} anim-floaty absolute left-[6%] top-[6%] w-[26%]`}
            style={{ ["--r" as never]: "-12deg" }}
          >
            <img src={cake} alt="" className="w-full drop-shadow-lg" />
          </button>

          <button
            type="button"
            onClick={() => setOpen("achievements")}
            aria-label="Open achievements unlocked"
            className={`${clickable} anim-wiggle absolute right-[6%] top-[6%] w-[28%]`}
            style={{ ["--r" as never]: "6deg" }}
          >
            <img src={cherries} alt="" className="w-full drop-shadow-lg" />
          </button>

          <button
            type="button"
            onClick={() => setOpen("letter")}
            aria-label="Open letter"
            className={`${clickable} anim-floaty absolute right-[2%] top-[40%] w-[24%]`}
            style={{ ["--r" as never]: "12deg" }}
          >
            <img src={envelope} alt="" className="w-full drop-shadow-lg" />
          </button>

          {/* Camera — positioned below and left of the portrait */}
          <button
            type="button"
            onClick={() => setOpen("pictorial")}
            aria-label="Open pictorial"
            className={`${clickable} anim-wiggle absolute top-[26%] left-[-2%] w-[34%]`}
            style={{ ["--r" as never]: "0deg" }}
          >
            <img src={camera} alt="" className="w-full drop-shadow-xl" />
          </button>

          {/* Non-interactive props */}
          <img
            src={jamJar}
            alt=""
            className="anim-floaty pointer-events-none absolute right-[30%] top-[2%] w-[20%] drop-shadow-lg"
            style={{ ["--r" as never]: "-12deg" }}
          />
          <img
            src={plate}
            alt=""
            className="anim-floaty pointer-events-none absolute left-[36%] top-[3%] w-[22%] drop-shadow-lg"
          />
          <img
            src={strawberryBasket}
            alt=""
            className="anim-floaty pointer-events-none absolute bottom-[2%] right-[20%] w-[24%] drop-shadow-xl"
          />
          <img
            src={raspberryBasket}
            alt=""
            className="anim-floaty pointer-events-none absolute bottom-[16%] right-[2%] w-[24%] drop-shadow-xl"
            style={{ ["--r" as never]: "-6deg" }}
          />
        </div>

        <p className="mt-4 text-center text-xs text-cream/90 drop-shadow">
          Tap the cake, cherries, envelope, or camera ✨
        </p>
      </section>

      <Dialog open={open !== null} onOpenChange={(v) => !v && setOpen(null)}>
        <DialogContent className="max-w-sm bg-cream">
          {open && (
            <>
              <DialogHeader>
                <DialogTitle
                  style={{ fontFamily: "Pinyon Script, cursive" }}
                  className="text-3xl text-berry"
                >
                  {MODAL_CONTENT[open].title}
                </DialogTitle>
                <DialogDescription className="text-berry-deep/80">
                  {MODAL_CONTENT[open].subtitle}
                </DialogDescription>
              </DialogHeader>
              <div className="text-berry-deep">{MODAL_CONTENT[open].body}</div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
}
