gsap.registerPlugin(ScrollTrigger)



gsap.fromTo(".arrow", { x: 500 }, { duration: 2, x: 10 })
gsap.fromTo("#top", { y: 100 }, { duration: 2.5, y: 0 })
gsap.fromTo("#bottom", { y: -100 }, { duration: 2, y: 0 })
gsap.fromTo(".cls-4", { stroke: "green" }, { duration: 2, stroke: "yellow" })
gsap.fromTo(".cls-3", { stroke: "blue" }, { stroke: "yellow" })
gsap.fromTo("#right", { x: 100 }, { duration: 1.5, x: 0 })
gsap.fromTo("#left", { x: -100 }, { duration: 1, x: 0 })
gsap.fromTo("body", { backgroundColor: "white" }, { backgroundColor: "black", color: "white" })
    // Using Locomotive Scroll from Locomotive https://github.com/locomotivemtl/locomotive-scroll

const locoScroll = new LocomotiveScroll({
    el: document.querySelector(".smooth-scroll"),
    smooth: true
});
// each time Locomotive Scroll updates, tell ScrollTrigger to update too (sync positioning)
locoScroll.on("scroll", ScrollTrigger.update);

// tell ScrollTrigger to use these proxy methods for the ".smooth-scroll" element since Locomotive Scroll is hijacking things
ScrollTrigger.scrollerProxy(".smooth-scroll", {
    scrollTop(value) {
        return arguments.length ? locoScroll.scrollTo(value, 0, 0) : locoScroll.scroll.instance.scroll.y;
    }, // we don't have to define a scrollLeft because we're only scrolling vertically.
    getBoundingClientRect() {
        return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
    },
    // LocomotiveScroll handles things completely differently on mobile devices - it doesn't even transform the container at all! So to get the correct behavior and avoid jitters, we should pin things with position: fixed on mobile. We sense it by checking to see if there's a transform applied to the container (the LocomotiveScroll-controlled element).
    pinType: document.querySelector(".smooth-scroll").style.transform ? "transform" : "fixed"
});


// --- RED PANEL ---
gsap.from(".line-1", {
    scrollTrigger: {
        trigger: ".line-1",
        scroller: ".smooth-scroll",
        scrub: true,
        start: "top bottom",
        end: "bottom top"
    },
    scaleX: 0,
    transformOrigin: "left center",
    ease: "bounce"
});


// --- ORANGE PANEL ---
gsap.from(".line-2", {
    scrollTrigger: {
        trigger: ".orange",
        scroller: ".smooth-scroll",
        scrub: true,
        pin: true,
        start: "top top",
        end: "+=100%"
    },
    scaleX: 0,
    transformOrigin: "left center",
    ease: "none"
});


// --- PURPLE/GREEN PANEL ---
var tl = gsap.timeline({
    scrollTrigger: {
        trigger: ".purple",
        scroller: ".smooth-scroll",
        scrub: true,
        pin: true,
        start: "top top",
        end: "+=100%"
    }
});

tl.from(".purple p", { scale: 0.3, rotation: 45, autoAlpha: 0, ease: "power2" })
    .from(".line-3", { scaleX: 0, transformOrigin: "left center", ease: "none" }, 0)
    .to(".purple", { backgroundColor: "#28a92b" }, 0);



// each time the window updates, we should refresh ScrollTrigger and then update LocomotiveScroll. 
ScrollTrigger.addEventListener("refresh", () => locoScroll.update());

// after everything is set up, refresh() ScrollTrigger and update LocomotiveScroll because padding may have been added for pinning, etc.
ScrollTrigger.refresh();