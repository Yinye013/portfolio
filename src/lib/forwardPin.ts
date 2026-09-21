import { gsap, ScrollTrigger } from "@/lib/gsap";
import { getLenis } from "@/components/SmoothScroll";

/**
 * Set while a collapse is moving the scroll position. A collapse shifts every
 * following section up by its own `distance`, which ScrollTrigger reports to
 * those sections as ordinary scrolling — enough, on its own, to drive a later
 * pin's timeline to the end and collapse it too, in the same gesture, with no
 * reveal ever shown. Advancing a timeline is suppressed while this is set, so
 * only genuine user scrolling moves a reveal forward.
 */
let correcting = false;

interface ForwardPinOptions {
  /** The section to pin. */
  trigger: Element;
  /**
   * Pinned scroll distance in px. This is also exactly the height the document
   * loses when the pin collapses, which is what the scroll correction uses.
   */
  distance: number;
  /** Paused timeline driven by the pin. Never touched by the collapse. */
  timeline: gsap.core.Timeline;
  /**
   * Shared high-water mark of the timeline, owned by the caller's useRef so it
   * survives a matchMedia / theme rebuild.
   */
  maxProgress: { current: number };
  /**
   * Set once the pin has been collapsed. Also caller-owned and persistent, so a
   * rebuild knows not to recreate the pin.
   */
  collapsed: { current: boolean };
}

/**
 * A pinned ScrollTrigger that drives `timeline` forward only, and then removes
 * itself.
 *
 * The timeline is built paused and advanced by hand from `onUpdate` rather than
 * handed to ScrollTrigger with a `scrub`: a scrub runs backwards on the way up,
 * and the requirement is that once a card has flown in or an icon has dropped
 * it stays put until a reload.
 *
 * The consequence is that after the reveal has played once the pin is dead
 * weight — `distance` px of scroll in which nothing animates, which reads as
 * frozen, laggy scroll on the way back up. So once the timeline is complete the
 * trigger kills itself, removing the pin spacer and letting the section scroll
 * at normal speed with its content already landed.
 */
export function createForwardPin({
  trigger,
  distance,
  timeline,
  maxProgress,
  collapsed,
}: ForwardPinOptions): ScrollTrigger | null {
  // Already collapsed on an earlier pass — a theme flip or matchMedia rebuild
  // must not resurrect the pin. The caller has already seeded the timeline to
  // maxProgress, so the content is sitting in its landed state and there is
  // nothing left to drive.
  if (collapsed.current) return null;

  let disposed = false;

  const collapse = (side: "above" | "below") => {
    if (disposed) return;
    disposed = true;
    collapsed.current = true;

    // Deferred out of onUpdate. Not for ScrollTrigger's iteration index — it
    // compensates that on splice — but because kill() swaps the pin out of its
    // spacer, i.e. mutates layout, in the middle of the update loop that every
    // other trigger on the page is being driven from. Let the frame finish.
    requestAnimationFrame(() => {
      const lenis = getLenis();
      const before = window.scrollY;

      // kill(true) reverts: the section is put back where the spacer was and
      // the spacer is removed. It does NOT touch our timeline — this trigger
      // has no `animation` of its own (no scrub/animation vars), so the
      // animation.revert()/animation.kill() branches inside kill() are both
      // skipped. The landed cards stay landed.
      st.kill(true);

      // Let every other pin recompute its start/end against the now-shorter
      // document before we move.
      ScrollTrigger.refresh();

      // Collapsing "above" removed `distance` px that sits entirely below the
      // viewport: nothing above us moved, so the scroll position is still
      // visually correct and touching it would itself cause a jump.
      if (side !== "below") return;

      // "below" removed `distance` px from above us, pulling everything that
      // follows up by exactly that much.
      const target = Math.max(0, before - distance);

      correcting = true;

      if (lenis) {
        // resize() first so Lenis's cached `limit` reflects the shorter
        // document; otherwise targetScroll clamps against a stale max for a
        // frame. immediate + force set animatedScroll and targetScroll
        // together, so Lenis's next raf has no stale value to snap back to.
        lenis.resize();
        lenis.scrollTo(target, { immediate: true, force: true });
      } else {
        window.scrollTo(0, target);
      }

      ScrollTrigger.update();

      // Held for two frames: one for ScrollTrigger.update() above to push the
      // new position through every trigger, and one for Lenis's own raf to
      // settle on it. Released after, so the next real scroll is honoured.
      requestAnimationFrame(() => {
        requestAnimationFrame(() => { correcting = false; });
      });
    });
  };

  // Once the reveal is done, collapse — but only from outside the pin window,
  // so the spacer being removed is never straddling the viewport. At progress
  // exactly 1 the section still fills the screen, and removing the spacer there
  // would visibly move the section itself.
  //
  // `maxProgress >= 1` is not on its own proof the reveal ran. Collapsing a
  // section shifts the scroll position by its own `distance`, which lands the
  // viewport somewhere inside — or past — the *next* pinned section. That
  // section's very next onUpdate then samples progress 1 and would collapse
  // too, without a single frame of its reveal having played. Requiring the
  // timeline itself to be complete is what distinguishes "the user scrolled
  // through this" from "the scroll position was moved underneath it".
  //
  // The threshold is a tolerance, not equality. Scroll progress is sampled per
  // frame and rarely lands on exactly 1, and the driving tween approaches the
  // end asymptotically, so `=== 1` is a condition that in practice never
  // arrives. Anything past 0.99 has played every reveal the eye can see.
  const DONE = 0.99;
  const revealed = () => timeline.progress() >= DONE;

  const collapseIfComplete = (progress: number) => {
    if (disposed || maxProgress.current < DONE || !revealed()) return;
    if (progress >= DONE) collapse("below");
    else if (progress <= 0) collapse("above");
  };

  const st = ScrollTrigger.create({
    trigger,
    start: "center center",
    end: `+=${distance}`,
    pin: true,
    anticipatePin: 1,
    onUpdate: (self) => {
      // Another section is collapsing and has moved us. This is not scrolling,
      // so it must not advance the reveal — and it must not raise the
      // high-water mark either: doing so would permanently block the reveal
      // from ever playing, since every later real scroll would compare against
      // a mark it can no longer beat.
      if (correcting) return;

      if (self.progress > maxProgress.current) {
        maxProgress.current = self.progress;
        // The short tween stands in for what `scrub` used to provide, so the
        // motion still reads as scroll-linked rather than snapping.
        gsap.to(timeline, {
          progress: self.progress,
          duration: 0.4,
          ease: "power2.out",
          overwrite: true,
        });
      }
      collapseIfComplete(self.progress);
    },
    // Backstops. A fast flick, or a Lenis frame that jumps the whole pin window
    // at once, can leave onUpdate without a sample near the boundary.
    //
    // Leaving past the end means the user has scrolled the entire pin, so the
    // reveal is owed in full: the driving tween is asynchronous and may still
    // be easing toward the end, which would fail the `revealed()` gate and
    // strand the pin forever. Settle it here rather than waiting for a tween
    // that no further scrolling will advance.
    onLeave: () => {
      if (correcting || disposed) return;
      gsap.killTweensOf(timeline);
      timeline.progress(1);
      maxProgress.current = 1;
      collapseIfComplete(1);
    },
    onLeaveBack: () => collapseIfComplete(0),
  });

  return st;
}
