<script setup lang="ts">
const COLORS = ["#d8b4fe", "#a855f7", "#3b82f6", "#ec4899", "#6366f1"];
const ICONS = [
  "i-lucide-swords",
  "i-lucide-heart",
  "i-lucide-gamepad-2",
  "i-lucide-scroll",
  "i-lucide-star",
];

interface Element {
  id: number;
  size: number;
  color: string;
  icon: string;
  revealDelay: number;
}

interface Motion {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  rv: number;
}

// Static per-icon data drives the render once. Positions live in a plain,
// non-reactive array and are written straight to the DOM each frame, so the
// animation loop never triggers a Vue re-render.
const elements = shallowRef<Element[]>([]);
// Indexed by element id (Vue does not guarantee v-for ref array order).
const elementRefs: (HTMLElement | null)[] = [];
const setElementRef = (id: number, node: unknown) => {
  elementRefs[id] = node instanceof HTMLElement ? node : null;
};
const iconsVisible = ref(false);

let motions: Motion[] = [];
let requestRef: number | null = null;
let initTimeout: ReturnType<typeof setTimeout> | null = null;
let revealTimeout: ReturnType<typeof setTimeout> | null = null;
const ELEMENT_COUNT = 22;
const BACKGROUND_BOOT_DELAY_MS = 800;
const BACKGROUND_REVEAL_DELAY_MS = 120;

const applyTransforms = () => {
  for (let i = 0; i < motions.length; i++) {
    const m = motions[i]!;
    const node = elementRefs[i];
    if (node) {
      node.style.transform = `translate(${m.x}px, ${m.y}px) rotate(${m.rotation}deg)`;
    }
  }
};

onMounted(() => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const update = () => {
    const maxX = window.innerWidth + 50;
    const maxY = window.innerHeight + 50;
    for (const m of motions) {
      m.x += m.vx;
      m.y += m.vy;
      if (m.x < -50 || m.x > maxX) m.vx *= -1;
      if (m.y < -50 || m.y > maxY) m.vy *= -1;
      m.rotation += m.rv;
    }
    applyTransforms();
    requestRef = requestAnimationFrame(update);
  };

  initTimeout = setTimeout(() => {
    motions = Array.from({ length: ELEMENT_COUNT }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 1.0,
      vy: (Math.random() - 0.5) * 1.0,
      rotation: Math.random() * 360,
      rv: (Math.random() - 0.5) * 1.2,
    }));
    elements.value = motions.map((_, id) => ({
      id,
      size: 24 + Math.random() * 32,
      color: COLORS[Math.floor(Math.random() * COLORS.length)] as string,
      icon: ICONS[Math.floor(Math.random() * ICONS.length)] as string,
      revealDelay: 200 + Math.random() * 2000,
    }));

    revealTimeout = setTimeout(() => {
      // Refs are populated after the render above; place icons before fading in.
      applyTransforms();
      iconsVisible.value = true;
      requestRef = requestAnimationFrame(update);
    }, BACKGROUND_REVEAL_DELAY_MS);
  }, BACKGROUND_BOOT_DELAY_MS);
});

onBeforeUnmount(() => {
  if (initTimeout) clearTimeout(initTimeout);
  if (revealTimeout) clearTimeout(revealTimeout);
  if (requestRef !== null) cancelAnimationFrame(requestRef);
});
</script>

<template>
  <div
    class="fixed inset-0 z-0 overflow-hidden select-none pointer-events-none bg-[#0a0a1a]"
  >
    <div
      class="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#1e1b4b_0%,#0a0a1a_100%)] opacity-60"
    />
    <div
      v-for="el in elements"
      :key="'el-' + el.id"
      :ref="(node: unknown) => setElementRef(el.id, node)"
      class="absolute transition-opacity duration-3000 ease-out blur-[0.5px] will-change-transform"
      :class="iconsVisible ? 'opacity-40' : 'opacity-0'"
      :style="{
        color: el.color,
        filter: `drop-shadow(0 0 8px ${el.color})`,
        transitionDelay: `${el.revealDelay}ms`,
      }"
    >
      <UIcon
        :name="el.icon"
        :style="{ width: el.size + 'px', height: el.size + 'px' }"
      />
    </div>
  </div>
</template>
