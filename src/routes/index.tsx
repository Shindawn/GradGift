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
import taylorSwiftSong from "@/assets/taylorswift.mp3";
import { Pause, Play, Volume2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

type CuteSound = "click" | "cake";

const playCuteSound = (sound: CuteSound) => {
  if (typeof window === "undefined") return;

  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return;

  const audioContext = new AudioContextClass();
  const now = audioContext.currentTime;
  const gain = audioContext.createGain();
  gain.connect(audioContext.destination);

  const finishAt = sound === "cake" ? 0.75 : 0.18;
  gain.gain.setValueAtTime(0.0001, now);

  if (sound === "click") {
    const oscillator = audioContext.createOscillator();
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(720, now);
    oscillator.frequency.exponentialRampToValueAtTime(1180, now + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.22, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + finishAt);
    oscillator.connect(gain);
    oscillator.start(now);
    oscillator.stop(now + finishAt);
  } else {
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((frequency, index) => {
      const start = now + index * 0.08;
      const oscillator = audioContext.createOscillator();
      oscillator.type = "triangle";
      oscillator.frequency.setValueAtTime(frequency, start);
      gain.gain.exponentialRampToValueAtTime(0.18, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.22);
      oscillator.connect(gain);
      oscillator.start(start);
      oscillator.stop(start + 0.28);
    });
  }

  window.setTimeout(
    () => {
      audioContext.close().catch(() => undefined);
    },
    finishAt * 1000 + 120,
  );
};

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Celebrate Cathmae's Graduation" },
      {
        name: "description",
        content: "Celebrate Cathmae's graduation with this strawberry picnic tribute.",
      },
      { property: "og:title", content: "Celebrate Cathmae's Graduation" },
      {
        property: "og:description",
        content: "Celebrate Cathmae's graduation with this strawberry picnic tribute.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "Celebrate Cathmae's Graduation" },
      {
        name: "twitter:description",
        content: "Celebrate Cathmae's graduation with this strawberry picnic tribute.",
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

function CakeWithCandle({ isBlowing }: { isBlowing: boolean }) {
  return (
    <div className="relative mx-auto w-3/4">
      <img src={cake} alt="Birthday cake" className="w-full drop-shadow-lg" />
      <div
        className={`absolute left-[50%] top-[16%] h-12 w-3 -translate-x-1/2 rounded-full bg-cream/90 shadow-[0_0_0_1px_rgba(0,0,0,0.08)] ${
          isBlowing ? "animate-candle-blow" : ""
        }`}
      />
      <div
        className={`absolute left-[50%] top-[8%] h-5 w-5 -translate-x-1/2 rounded-full transition-all duration-300 ${
          isBlowing ? "opacity-0" : "animate-candle-flicker"
        }`}
        style={{
          background:
            "radial-gradient(circle at 40% 30%, rgba(255,235,179,1), rgba(252,211,77,0.95), rgba(251,146,60,0.8), rgba(249,115,22,0.65))",
        }}
      />
      {isBlowing ? (
        <>
          <div className="absolute left-[47%] top-[3%] h-5 w-5 -translate-x-1/2 rounded-full bg-white/70 blur-sm animate-smoke-puff" />
          <div className="absolute left-[53%] top-[6%] h-4 w-4 -translate-x-1/2 rounded-full bg-white/60 blur-sm animate-smoke-puff delay-150" />
        </>
      ) : null}
    </div>
  );
}

function CakeModalBody({
  isListening,
  hasBlown,
  volume,
  status,
  onStart,
}: {
  isListening: boolean;
  hasBlown: boolean;
  volume: number;
  status: "idle" | "listening" | "success" | "error";
  onStart: () => void;
}) {
  return (
    <div className="space-y-4 text-sm text-berry-deep">
      <div className="rounded-[2rem] border border-berry/20 bg-cream/80 p-4 shadow-[0_18px_40px_rgba(0,0,0,0.12)]">
        <CakeWithCandle isBlowing={status === "listening" || hasBlown} />
        <div className="mt-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.26em] text-berry-deep/70">
              {hasBlown ? "Wish received" : "Blow into your mic"}
            </p>
            <p className="mt-1 text-[0.7rem] text-berry-deep/80">
              {hasBlown
                ? "You earned this one. Congrats!"
                : "Blow gently, then watch the candle go out."}
            </p>
          </div>
          <span className="rounded-full bg-berry/10 px-3 py-1 text-[0.7rem] text-berry-deep">
            {Math.round(Math.min(100, volume * 300))}%
          </span>
        </div>
        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-berry/10">
          <div
            className="h-full rounded-full bg-berry transition-all duration-150"
            style={{ width: `${Math.min(100, volume * 300)}%` }}
          />
        </div>
      </div>

      {status === "error" ? (
        <div className="rounded-xl bg-red-100 px-3 py-2 text-xs text-red-700">
          Microphone permission is required to blow the candle. Allow audio access and try again.
        </div>
      ) : null}

      {hasBlown ? (
        <div className="rounded-2xl border border-berry/20 bg-berry/10 p-4 text-center text-sm text-berry-deep">
          <p className="font-semibold text-berry">Congrats! grad u ate.</p>
          <p className="mt-2 text-xs text-berry-deep/80">
            The wish is now tucked into the cherry basket with our strawberry theme.
          </p>
        </div>
      ) : (
        <button
          type="button"
          onClick={onStart}
          className="w-full rounded-full bg-berry px-4 py-2 text-sm font-semibold text-cream transition hover:bg-berry-deep"
        >
          {status === "listening" ? "Listening..." : "Blow the candle"}
        </button>
      )}

      {!hasBlown ? (
        <p className="text-xs text-berry-deep/70">Tip: speak or blow softly into the mic.</p>
      ) : null}
    </div>
  );
}

function DiscoSongBody({
  songSrc,
  isPlaying,
  onPlay,
  onStop,
}: {
  songSrc: string;
  isPlaying: boolean;
  onPlay: () => void;
  onStop: () => void;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const mirrorTiles = Array.from({ length: 64 }, (_, index) => index);

  const formatTime = (seconds: number) => {
    if (!Number.isFinite(seconds)) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const togglePlayback = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      audio.play().catch(() => onStop());
    } else {
      audio.pause();
    }
  };

  const seekTo = (value: string) => {
    const audio = audioRef.current;
    if (!audio || duration === 0) return;
    const nextTime = (Number(value) / 100) * duration;
    audio.currentTime = nextTime;
    setCurrentTime(nextTime);
  };

  return (
    <div className="space-y-4">
      <div className="relative mx-auto flex h-56 w-full max-w-[18rem] items-end justify-center overflow-hidden rounded-sm border border-berry/15 bg-[radial-gradient(circle_at_50%_22%,rgba(255,246,218,0.92),rgba(255,246,218,0.22)_18%,rgba(127,24,58,0.18)_48%,rgba(28,58,38,0.32)_100%)] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.26),0_18px_45px_rgba(0,0,0,0.18)]">
        <div className="absolute inset-x-0 bottom-0 h-20 bg-[linear-gradient(180deg,rgba(255,246,218,0),rgba(244,234,212,0.86))]" />
        <div className="absolute left-1/2 top-0 h-14 w-px -translate-x-1/2 bg-berry-deep/45 shadow-[0_0_18px_rgba(255,246,218,0.7)]" />
        <div className="absolute left-1/2 top-12 h-2 w-12 -translate-x-1/2 rounded-full bg-berry-deep/45 shadow-[0_2px_8px_rgba(0,0,0,0.18)]" />
        <div
          className={`absolute left-[-16%] top-8 h-28 w-44 origin-right -rotate-[24deg] bg-[linear-gradient(90deg,rgba(255,246,218,0),rgba(255,92,138,0.2),rgba(255,246,218,0.48),rgba(255,246,218,0))] blur-[1px] ${
            isPlaying ? "animate-light-sweep" : ""
          }`}
        />
        <div
          className={`absolute right-[-16%] top-10 h-28 w-44 origin-left rotate-[24deg] bg-[linear-gradient(90deg,rgba(255,246,218,0),rgba(126,224,129,0.16),rgba(255,246,218,0.42),rgba(255,246,218,0))] blur-[1px] ${
            isPlaying ? "animate-light-sweep-reverse" : ""
          }`}
        />
        <div className="absolute bottom-7 h-8 w-52 rounded-[50%] bg-berry-deep/18 blur-sm" />
        <div
          className={`relative mb-12 h-36 w-36 overflow-hidden rounded-full border border-cream/80 bg-[radial-gradient(circle_at_34%_26%,#ffffff_0_6%,#f8f1dc_7%_15%,#d7c9aa_28%,#8f8b85_58%,#3b3236_100%)] shadow-[0_26px_40px_rgba(0,0,0,0.28),inset_-24px_-20px_32px_rgba(48,42,44,0.5),inset_18px_12px_26px_rgba(255,255,255,0.5)] ${
            isPlaying ? "animate-disco-spin" : ""
          }`}
        >
          <div className="absolute inset-0 grid grid-cols-8 grid-rows-8 rounded-full opacity-90 [clip-path:circle(50%)]">
            {mirrorTiles.map((tile) => {
              const row = Math.floor(tile / 8);
              const col = tile % 8;
              const centerDistance = Math.abs(col - 3.5) + Math.abs(row - 3.5);
              const lightness = 92 - centerDistance * 8;
              const tint =
                (row + col) % 5 === 0
                  ? "rgba(200,50,74,0.28)"
                  : (row + col) % 4 === 0
                    ? "rgba(126,224,129,0.18)"
                    : "rgba(255,246,218,0.2)";

              return (
                <span
                  key={tile}
                  className="border-[0.5px] border-white/35 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.55),inset_-1px_-1px_2px_rgba(38,34,36,0.28)]"
                  style={{
                    background: `linear-gradient(135deg, rgba(255,255,255,0.82), ${tint}), hsl(38 18% ${lightness}%)`,
                  }}
                />
              );
            })}
          </div>
          <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_32%_22%,rgba(255,255,255,0.95),rgba(255,255,255,0.32)_10%,rgba(255,255,255,0)_22%),linear-gradient(120deg,rgba(255,255,255,0.36),rgba(255,255,255,0)_36%,rgba(0,0,0,0.24)_76%)]" />
          <div
            className={`absolute left-[58%] top-[18%] h-3 w-3 rounded-full bg-white shadow-[0_0_18px_8px_rgba(255,246,218,0.8)] ${
              isPlaying ? "animate-disco-glint" : ""
            }`}
          />
        </div>
      </div>

      <div className="rounded-md border border-berry/20 bg-cream/80 p-4 shadow-[0_16px_35px_rgba(0,0,0,0.12)]">
        <audio
          ref={audioRef}
          autoPlay
          src={songSrc}
          onPlay={onPlay}
          onPause={onStop}
          onEnded={onStop}
          onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
          onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
        />
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={togglePlayback}
            aria-label={isPlaying ? "Pause song" : "Play song"}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-berry text-cream shadow-[0_10px_22px_rgba(127,24,58,0.28)] transition hover:bg-berry-deep"
          >
            {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 pl-0.5" />}
          </button>

          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-3 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-berry-deep/70">
              <span>Taylor Swift</span>
              <span className="whitespace-nowrap">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={(event) => seekTo(event.currentTarget.value)}
              aria-label="Song progress"
              className="mt-3 h-2 w-full cursor-pointer accent-berry"
              style={{
                background: `linear-gradient(90deg, #c8324a ${progress}%, rgba(127,24,58,0.15) ${progress}%)`,
              }}
            />
          </div>
        </div>

        <div className="mt-3 flex items-center gap-2 text-xs text-berry-deep/70">
          <Volume2 className="h-4 w-4 text-berry" />
          <span>{isPlaying ? "Now playing" : "Press play to start the song"}</span>
        </div>
      </div>
    </div>
  );
}

function ShareModalBody({
  currentUrl,
  shareCopied,
  onShare,
  onCopy,
}: {
  currentUrl: string;
  shareCopied: boolean;
  onShare: (platform: "twitter" | "facebook" | "whatsapp") => void;
  onCopy: () => Promise<void>;
}) {
  return (
    <div className="space-y-4 text-sm text-berry-deep">
      <div className="grid gap-3 sm:grid-cols-3">
        <button
          type="button"
          onClick={() => onShare("twitter")}
          className="rounded-full border border-berry/15 bg-cream/90 px-4 py-3 text-sm font-semibold text-berry-deep transition hover:bg-berry/10"
        >
          Twitter
        </button>
        <button
          type="button"
          onClick={() => onShare("facebook")}
          className="rounded-full border border-berry/15 bg-cream/90 px-4 py-3 text-sm font-semibold text-berry-deep transition hover:bg-berry/10"
        >
          Facebook
        </button>
        <button
          type="button"
          onClick={() => onShare("whatsapp")}
          className="rounded-full border border-berry/15 bg-cream/90 px-4 py-3 text-sm font-semibold text-berry-deep transition hover:bg-berry/10"
        >
          WhatsApp
        </button>
      </div>

      <div className="rounded-2xl border border-berry/15 bg-white/80 p-2 sm:p-3 shadow-[0_10px_30px_rgba(0,0,0,0.08)]">
        <div className="flex flex-wrap items-center gap-2">
          <input
            readOnly
            value={currentUrl}
            className="min-w-0 flex-1 rounded-xl border border-berry/10 bg-cream/80 px-2 sm:px-3 py-2 text-xs text-berry-deep shadow-sm"
          />
          <button
            type="button"
            onClick={onCopy}
            className="rounded-lg bg-berry px-3 py-2 text-xs font-semibold text-cream transition hover:bg-berry-deep"
          >
            {shareCopied ? "Copied!" : "Copy link"}
          </button>
        </div>
        <p className="mt-2 text-[0.68rem] text-berry-deep/70">
          Copy the page link to share it anywhere.
        </p>
      </div>
    </div>
  );
}

function PictorialModalBody() {
  const [isDoodleVisible, setIsDoodleVisible] = useState(false);

  return (
    <div className="overflow-hidden rounded-md bg-cream/40 p-2">
      <button
        type="button"
        onClick={() => setIsDoodleVisible((visible) => !visible)}
        aria-pressed={isDoodleVisible}
        aria-label="Show graduation doodle on photo"
        className="group relative block w-full cursor-pointer overflow-hidden rounded-sm focus:outline-none focus:ring-2 focus:ring-berry/60"
      >
        <img
          src={graduatePhoto}
          alt="Cathmae's graduation portrait"
          className="h-auto w-full object-cover"
        />
        <div
          className={`pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100 ${
            isDoodleVisible ? "opacity-100" : ""
          }`}
        >
          <div className="absolute inset-0 bg-cream/5" />
          <svg
            viewBox="0 0 100 125"
            aria-hidden="true"
            className="absolute inset-0 h-full w-full animate-doodle-pop"
          >
            <defs>
              <filter id="doodleShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow
                  dx="0"
                  dy="1.2"
                  stdDeviation="1.4"
                  floodColor="#1f1b22"
                  floodOpacity="0.55"
                />
              </filter>
            </defs>
            <g filter="url(#doodleShadow)">
              <text
                x="50"
                y="87"
                textAnchor="middle"
                fill="#fff6da"
                stroke="#2b2025"
                strokeWidth="0.85"
                paintOrder="stroke fill"
                fontFamily="'Pinyon Script', cursive"
                fontSize="13"
                transform="rotate(-5 50 87)"
              >
                Just graduated!
              </text>
            </g>
          </svg>
        </div>
      </button>
      <p className="mt-3 text-center text-xs italic text-berry-deep">
        Catherine Mae B. Pontanarest &middot; USANT Batch 2026
      </p>
    </div>
  );
}

const WISHES = [
  {
    label: "First wish",
    accent: "#c8324a",
    text: "May you path be as gentle as your compassion for others.",
  },
  {
    label: "Second wish",
    accent: "#dfb959",
    text: "May every almost turn into absolutely",
  },
  {
    label: "Third wish",
    accent: "#be5778",
    text: "May your heart stay soft while dreams grow big",
  },
  {
    label: "Fourth wish",
    accent: "#4b7f45",
    text: "May you keep choosing yourself, again and again.",
  },
];

function WishesModalBody() {
  const [openedWishes, setOpenedWishes] = useState<number[]>([]);

  const toggleWish = (index: number) => {
    setOpenedWishes((current) =>
      current.includes(index)
        ? current.filter((wishIndex) => wishIndex !== index)
        : [...current, index],
    );
  };

  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {WISHES.map((wish, index) => {
        const isOpen = openedWishes.includes(index);

        return (
          <button
            key={wish.label}
            type="button"
            onClick={() => toggleWish(index)}
            aria-expanded={isOpen}
            className="group relative min-h-[6.5rem] sm:min-h-36 overflow-hidden rounded-md border border-berry/20 bg-[linear-gradient(145deg,rgba(255,246,218,0.96),rgba(255,232,220,0.86))] p-3 sm:p-4 text-left shadow-[0_10px_24px_rgba(127,24,58,0.12)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(127,24,58,0.16)] focus:outline-none focus:ring-2 focus:ring-berry/60"
          >
            <span className="absolute -right-5 -top-5 h-16 w-16 rounded-full bg-berry/10 sm:h-20 sm:w-20" />
            <span className="absolute bottom-3 right-4 text-xl sm:text-2xl leading-none text-berry/60">
              🍒
            </span>

            <span
              className={`absolute left-0 top-1/2 h-7 w-full -translate-y-1/2 transition duration-500 ${
                isOpen ? "scale-x-110 opacity-20" : "opacity-95"
              }`}
              style={{ backgroundColor: wish.accent }}
            />
            <span
              className={`absolute left-1/2 top-0 h-full w-7 -translate-x-1/2 transition duration-500 ${
                isOpen ? "scale-y-110 opacity-20" : "opacity-95"
              }`}
              style={{ backgroundColor: wish.accent }}
            />
            <span
              className={`absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-cream bg-berry shadow-[0_8px_18px_rgba(127,24,58,0.24)] transition duration-500 ${
                isOpen ? "scale-75 opacity-0" : "opacity-100 group-hover:rotate-6"
              }`}
            >
              <span className="absolute left-1/2 top-1/2 h-4 w-8 sm:h-5 sm:w-9 -translate-x-1/2 -translate-y-1/2 rounded-[50%] border-2 border-cream bg-transparent" />
            </span>

            <span
              className={`relative z-10 flex h-full min-h-28 flex-col justify-between transition duration-500 ${
                isOpen ? "opacity-100" : "opacity-0"
              }`}
            >
              <span className="text-[0.62rem] sm:text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-berry-deep/70">
                {wish.label}
              </span>
              <span className="mt-6 sm:mt-8 block text-[0.88rem] sm:text-sm leading-relaxed text-berry-deep">
                {wish.text}
              </span>
            </span>

          </button>
        );
      })}
    </div>
  );
}

type ModalKey =
  | "letter"
  | "pictorial"
  | "wishes"
  | "achievements"
  | "share"
  | "cake"
  | "music"
  | null;

const MODAL_CONTENT: Record<
  Exclude<ModalKey, "cake" | "music" | "share" | null>,
  { title: string; subtitle: string; body: React.ReactNode }
> = {
  letter: {
    title: "A Letter For You",
    subtitle: "From everyone who cheered you on",
    body: (
      <div className="space-y-3 text-sm leading-relaxed">
        <p>Dearest Cathmae,</p>
        <p>
          Cum Laude, yay you did it! All those late nights and sacrifices paid off. I've always admired your discipline
          and heart, and this proves it. You inspire me so much.
        </p>
        <p>
          Thank you for being the kind of person who makes a whole room feel lighter. We are
          endlessly proud of you. Keep striving, mwa.
        </p>
        <p className="italic text-berry-deep">— With love, lescy</p>
      </div>
    ),
  },
  pictorial: {
    title: "Pictorial",
    subtitle: "A moment worth keeping",
    body: <PictorialModalBody />,
  },
  wishes: {
    title: "Wishes",
    subtitle: "Sweet notes for the road ahead",
    body: <WishesModalBody />,
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
  const [cakeStatus, setCakeStatus] = useState<"idle" | "listening" | "success" | "error">("idle");
  const [cakeVolume, setCakeVolume] = useState(0);
  const [cakeBlown, setCakeBlown] = useState(false);
  const [isSongPlaying, setIsSongPlaying] = useState(false);
  const [currentUrl, setCurrentUrl] = useState("");
  const [shareCopied, setShareCopied] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const handleButtonClick = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return;
      if (!event.target.closest("button")) return;
      playCuteSound("click");
    };

    document.addEventListener("click", handleButtonClick);
    return () => document.removeEventListener("click", handleButtonClick);
  }, []);

  useEffect(() => {
    if (cakeStatus !== "success" || !cakeBlown) return;
    playCuteSound("cake");
  }, [cakeStatus, cakeBlown]);

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
      @keyframes fade-up { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
      @keyframes candle-flicker { 0%,100%{transform:scaleY(1) translateY(0)} 50%{transform:scaleY(1.04) translateY(-1px)} }
      @keyframes candle-blow { 0%{transform:translateY(0) scaleY(1)} 30%{transform:translateY(-3px) scaleY(0.96)} 100%{transform:translateY(-8px) scaleY(0.86)} }
      @keyframes smoke-puff { 0%{opacity:0;transform:translateY(0) scale(0.35)} 20%{opacity:0.65;transform:translateY(-10px) scale(0.75)} 100%{opacity:0;transform:translateY(-36px) scale(1.2)} }
      @keyframes disco-spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
      @keyframes light-sweep { 0%,100%{transform:rotate(-24deg) translateX(-4px);opacity:.42} 50%{transform:rotate(-10deg) translateX(22px);opacity:.82} }
      @keyframes light-sweep-reverse { 0%,100%{transform:rotate(24deg) translateX(4px);opacity:.38} 50%{transform:rotate(10deg) translateX(-22px);opacity:.76} }
      @keyframes disco-glint { 0%,100%{opacity:.45;transform:scale(.65)} 45%{opacity:1;transform:scale(1.25)} 70%{opacity:.72;transform:scale(.9)} }
      @keyframes doodle-pop { 0%{transform:scale(.96) rotate(-1deg)} 55%{transform:scale(1.015) rotate(.7deg)} 100%{transform:scale(1) rotate(0)} }
      .anim-floaty  { animation: floaty 4.5s ease-in-out infinite; }
      .anim-sway    { animation: sway 5s ease-in-out infinite; transform-origin: 50% 100%; }
      .anim-wiggle  { animation: wiggle 3.8s ease-in-out infinite; }
      .anim-breathe { animation: blanket-breathe 7s ease-in-out infinite; }
      .anim-shimmer { animation: shimmer 3.2s ease-in-out infinite; }
      .anim-fade-up { animation: fade-up .9s ease-out both; }
      .animate-candle-flicker { animation: candle-flicker 0.22s ease-in-out infinite; }
      .animate-candle-blow { animation: candle-blow 1.9s ease-out forwards; }
      .animate-smoke-puff { animation: smoke-puff 1.4s ease-out forwards; }
      .animate-disco-spin { animation: disco-spin 1.8s linear infinite; }
      .animate-light-sweep { animation: light-sweep 2.8s ease-in-out infinite; }
      .animate-light-sweep-reverse { animation: light-sweep-reverse 3.2s ease-in-out infinite; }
      .animate-disco-glint { animation: disco-glint 1.7s ease-in-out infinite; }
      .animate-doodle-pop { animation: doodle-pop .42s ease-out both; transform-origin: 50% 42%; }
    `;
    document.head.appendChild(style);
  }, []);

  const micPermissionRequestedRef = useRef(false);

  const requestCakeMicrophonePermission = async () => {
    if (micPermissionRequestedRef.current) return;
    micPermissionRequestedRef.current = true;

    if (!navigator.mediaDevices?.getUserMedia) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((track) => track.stop());
    } catch {
      // Permission prompt may have been denied or blocked. We'll still let the user try again.
    }
  };

  const playSong = () => {
    setIsSongPlaying(false);
    setOpen("music");
  };

  const openMusicTab = () => {
    playSong();
  };

  const openShareModal = () => {
    setOpen("share");
  };

  const shareText = "Celebrate Cathmae's graduation with this strawberry picnic tribute!";

  const shareToPlatform = (platform: "twitter" | "facebook" | "whatsapp") => {
    if (!currentUrl) return;
    const encodedUrl = encodeURIComponent(currentUrl);
    const encodedText = encodeURIComponent(shareText);
    let href = "";

    switch (platform) {
      case "twitter":
        href = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
        break;
      case "facebook":
        href = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case "whatsapp":
        href = `https://api.whatsapp.com/send?text=${encodedText}%20${encodedUrl}`;
        break;
    }

    window.open(href, "_blank", "noopener,noreferrer");
  };

  const copyShareLink = async () => {
    const urlToCopy = typeof window !== "undefined" ? window.location.href : currentUrl;
    if (!urlToCopy) return;

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(urlToCopy);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = urlToCopy;
        textArea.setAttribute("readonly", "");
        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }
      setShareCopied(true);
    } catch {
      setShareCopied(false);
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("music") === "cherry") {
      playSong();
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setCurrentUrl(window.location.href);
  }, []);

  useEffect(() => {
    if (!shareCopied) return;
    const timeout = window.setTimeout(() => setShareCopied(false), 2200);
    return () => window.clearTimeout(timeout);
  }, [shareCopied]);

  const openCakeModal = () => {
    requestCakeMicrophonePermission();
    setOpen("cake");
    setCakeStatus("idle");
    setCakeVolume(0);
    setCakeBlown(false);
  };

  const cleanupCakeAudio = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => undefined);
      audioContextRef.current = null;
    }
    sourceRef.current = null;
    analyserRef.current = null;
  };

  const startCakeBlow = async () => {
    if (cakeStatus === "listening" || cakeBlown) return;
    if (!navigator.mediaDevices?.getUserMedia) {
      setCakeStatus("error");
      return;
    }

    try {
      setCakeStatus("listening");
      setCakeVolume(0);
      setCakeBlown(false);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 2048;
      source.connect(analyser);
      audioContextRef.current = audioContext;
      sourceRef.current = source;
      analyserRef.current = analyser;
      streamRef.current = stream;
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      let blowFrames = 0;

      const tick = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteTimeDomainData(dataArray);
        let sum = 0;
        for (const value of dataArray) {
          const normalized = value / 128 - 1;
          sum += normalized * normalized;
        }
        const rms = Math.sqrt(sum / dataArray.length);
        setCakeVolume(rms);

        if (rms > 0.08) {
          blowFrames += 1;
        } else {
          blowFrames = 0;
        }

        if (blowFrames > 5) {
          setCakeBlown(true);
          setCakeStatus("success");
          cleanupCakeAudio();
          return;
        }

        animationRef.current = requestAnimationFrame(tick);
      };

      tick();
    } catch (error) {
      setCakeStatus("error");
      cleanupCakeAudio();
    }
  };

  useEffect(() => {
    if (open !== "cake") {
      cleanupCakeAudio();
      if (cakeStatus !== "success") {
        setCakeStatus("idle");
      }
    }

    return () => {
      cleanupCakeAudio();
    };
  }, [open]);

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

      <section className="relative mx-auto flex min-h-screen w-full max-w-md flex-col items-center justify-center px-4 py-10">
        <div className="relative aspect-[3/4] w-full anim-fade-up">
          {/* Gingham picnic blanket */}
          <Gingham className="anim-breathe absolute left-1/2 top-1/2 h-[78%] w-[92%] -translate-x-1/2 -translate-y-1/2 rounded-sm" />

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
              UNIVERSITY OF SAINT ANTHONY
            </div>

            <div
              className="mt-3 text-berry"
              style={{ fontFamily: "Pinyon Script, cursive", fontSize: "2rem", lineHeight: 0.95 }}
            >
              Catherine Mae
            </div>
            <div
              className="text-berry"
              style={{ fontFamily: "Pinyon Script, cursive", fontSize: "2rem", lineHeight: 1 }}
            >
              B. Pontanares
            </div>

            <div className="mt-3 text-[0.6rem] font-semibold tracking-[0.14em] text-berry-deep">
              BS in PSYCHOLOGY
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
            onClick={openCakeModal}
            aria-label="Open cake celebration"
            className={`${clickable} anim-floaty absolute left-[6%] top-[6%] w-[26%]`}
            style={{ ["--r" as never]: "-12deg" }}
          >
            <CakeWithCandle isBlowing={false} />
          </button>

          <button
            type="button"
            onClick={openMusicTab}
            aria-label="Open music in the cherry basket"
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
          <button
            type="button"
            onClick={openShareModal}
            aria-label="Share this picnic tribute"
            className={`${clickable} anim-floaty absolute left-[36%] top-[3%] w-[22%]`}
          >
            <img src={plate} alt="Share plate" className="w-full drop-shadow-lg" />
          </button>
          <img
            src={strawberryBasket}
            alt=""
            className="anim-floaty pointer-events-none absolute bottom-[2%] right-[20%] w-[24%] drop-shadow-xl"
          />
          <button
            type="button"
            onClick={() => setOpen("wishes")}
            aria-label="Open wishes"
            className={`${clickable} anim-floaty absolute bottom-[16%] right-[2%] w-[24%]`}
            style={{ ["--r" as never]: "-6deg" }}
          >
            <img src={raspberryBasket} alt="" className="w-full drop-shadow-xl" />
          </button>
        </div>

        <p className="mt-4 text-center text-xs text-cream/90 drop-shadow">
          Tap the strawberry cake to celebrate, camera, letter and cherries! ✨
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
                  {open === "cake"
                    ? "Blow the Strawberry Cake"
                    : open === "music"
                      ? "Cherry Disco"
                      : open === "share"
                        ? "Share the Celebration"
                        : MODAL_CONTENT[open].title}
                </DialogTitle>
                <DialogDescription className="text-berry-deep/80">
                  {open === "cake"
                    ? "Blow the candle and hear your own celebration."
                    : open === "music"
                      ? "You're On Your Own, Kid"
                      : open === "share"
                        ? "Share this grad tribute with friends."
                        : MODAL_CONTENT[open].subtitle}
                </DialogDescription>
              </DialogHeader>
              <div className="text-berry-deep">
                {open === "cake" ? (
                  <CakeModalBody
                    isListening={cakeStatus === "listening"}
                    hasBlown={cakeBlown}
                    volume={cakeVolume}
                    status={cakeStatus}
                    onStart={startCakeBlow}
                  />
                ) : open === "music" ? (
                  <DiscoSongBody
                    songSrc={taylorSwiftSong}
                    isPlaying={isSongPlaying}
                    onPlay={() => setIsSongPlaying(true)}
                    onStop={() => setIsSongPlaying(false)}
                  />
                ) : open === "share" ? (
                  <ShareModalBody
                    currentUrl={currentUrl}
                    shareCopied={shareCopied}
                    onShare={shareToPlatform}
                    onCopy={copyShareLink}
                  />
                ) : (
                  MODAL_CONTENT[open].body
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
}
