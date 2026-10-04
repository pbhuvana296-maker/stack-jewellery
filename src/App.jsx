import React, {
  useState,
  useRef,
  useLayoutEffect,
  useEffect,
} from "react";

import gsap from "gsap";
import "./App.css";

// =================================
// PRODUCT DATA
// =================================

const products = [
  {
    name: "Golden Bangle",
    price: "₹49,999",
    image: "/images/bangel.png",
  },
  {
    name: "Diamond Earrings",
    price: "₹39,999",
    image: "/images/earing.png",
  },
  {
    name: "Golden Necklace",
    price: "₹89,999",
    image: "/images/neckles.png",
  },
  {
    name: "Diamond Ring",
    price: "₹29,999",
    image: "/images/ring.png",
  },
  {
    name: "Golden Chain",
    price: "₹59,999",
    image: "/images/chain.png",
  },
  {
    name: "Traditional Jhumka",
    price: "₹29,999",
    image: "/images/jhumka.png",
  },
  {
    name: "Crystal Necklace",
    price: "₹99,999",
    image: "/images/crystal.png",
  },
];

// =================================
// MAIN APP
// =================================

export default function App() {
  const [details, setDetails] = useState(false);
  const [selected, setSelected] = useState(0);
  const [cart, setCart] = useState(false);

  const homeRef = useRef(null);
  const detailRef = useRef(null);

  // =================================
  // AUTOMATIC HOME TO DETAILS
  // =================================
// =================================
// AUTOMATIC HOME TO DETAILS
// =================================

useEffect(() => {
  if (details) return;

  const timer = setTimeout(() => {
    setSelected(0);
    setCart(false);
    setDetails(true);
  }, 4000);

  return () => clearTimeout(timer);
}, [details]);

  // =================================
  // HOME CENTER SPREAD ANIMATION
  // =================================

  useLayoutEffect(() => {
    if (details || !homeRef.current) return;

    const cards = gsap.utils.toArray(
      homeRef.current.querySelectorAll(".home-card")
    );

    if (!cards.length) return;

    const centerIndex = Math.floor(cards.length / 2);

    const ctx = gsap.context(() => {
      gsap.from(".heading", {
        y: -35,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      });

      // ALL CARDS START BEHIND CENTER CARD

      gsap.set(cards, {
        x: 0,
        y: 0,
        scale: 0.85,
        rotation: 0,
        opacity: 1,
        zIndex: (i) => 50 - Math.abs(i - centerIndex),
      });

      // CENTER CARD

      gsap.set(cards[centerIndex], {
        scale: 1.12,
        zIndex: 100,
      });

      // ALL CARDS SPREAD TO BOTH SIDES TOGETHER

      const positions = [-510, -340, -170, 0, 170, 340, 510];
      const verticalPositions = [15, 5, -5, 0, -5, 5, 15];
      const rotations = [-3, -2, -1, 0, 1, 2, 3];

      gsap.to(cards, {
        x: (i) => positions[i],
        y: (i) => verticalPositions[i],
        scale: (i) => i === centerIndex ? 1.12 : 1,
        rotation: (i) => rotations[i],
        zIndex: (i) => i === centerIndex ? 100 : 50 - Math.abs(i - centerIndex),
        duration: 1.5,
        stagger: 0,
        ease: "power3.out",
      });

    }, homeRef);

    return () => ctx.revert();

  }, [details]);

  // =================================
  // STACK CARD ANIMATION
  // =================================

  useLayoutEffect(() => {
    if (!details || !detailRef.current) return;

    const cards = gsap.utils.toArray(
      detailRef.current.querySelectorAll(".detail-card")
    );

    const info = detailRef.current.querySelector(
      ".product-info"
    );

    if (!cards.length) return;

    const ctx = gsap.context(() => {
      // INITIAL STACK POSITION

      gsap.set(cards, {
        x: (i) => i * 8,
        y: (i) => i * 5,
        rotation: (i) => i * 1.2,
        scale: (i) => 1 - i * 0.012,
        opacity: 1,
        zIndex: (i) => cards.length - i,
      });

      gsap.set(info, {
        opacity: 0,
        x: 45,
      });

      // MAIN TIMELINE

      const timeline = gsap.timeline({
        repeat: 0,

        onComplete: () => {
          setSelected(0);
          setCart(false);
          setDetails(false);
        },
      });

      // PRODUCT INFORMATION ENTER

      timeline.to(info, {
        opacity: 1,
        x: 0,
        duration: 0.8,
        ease: "power3.out",
      });

      // EACH CARD COMES TO FRONT

      cards.forEach((card, index) => {
        const previousCard = index > 0
          ? cards[index - 1]
          : null;

        // CHANGE PRODUCT DETAILS

        timeline.call(() => {
          setSelected(index);
          setCart(false);
        });

        // BRING CURRENT CARD FRONT

        timeline.set(card, {
          zIndex: 100 + index,
        });

        // PREVIOUS CARD GOES BACK

        if (previousCard) {
          timeline.to(
            previousCard,
            {
              x: 28,
              y: 18,
              scale: 0.91,
              rotation: 4,
              duration: 0.55,
              ease: "power2.inOut",
            },
            "<"
          );

          timeline.set(previousCard, {
            zIndex: index,
          });
        }

        // CURRENT CARD COMES FORWARD

        timeline.to(card, {
          x: 0,
          y: 0,
          scale: 1,
          rotation: 0,
          opacity: 1,
          duration: 0.75,
          ease: "back.out(1.4)",
        });

        // SHOW PRODUCT

        timeline.to(card, {
          duration: 1.5,
        });
      });

      // LAST CARD STAYS VISIBLE BRIEFLY

      timeline.to({}, {
        duration: 0.8,
      });

      // ALL CARDS RETURN TO ORIGINAL STACK

      timeline.to(cards, {
        x: (i) => i * 8,
        y: (i) => i * 5,
        scale: (i) => 1 - i * 0.012,
        rotation: (i) => i * 1.2,
        opacity: 1,
        duration: 0.8,
        stagger: 0.05,
        ease: "power2.inOut",
      });

      // RESTORE STACK ORDER

      timeline.set(cards, {
        zIndex: (i) => cards.length - i,
      });

    }, detailRef);

    return () => ctx.revert();

  }, [details]);

  // =================================
  // ADD TO CART
  // =================================

  const addToCart = () => {
    setCart(true);
  };

  // =================================
  // JSX
  // =================================

  return (
    <main className="app">

      {/* =================================
          FIRST SCREEN - CENTER SPREAD
      ================================= */}

      {!details && (
        <section
          className="home-page"
          ref={homeRef}
        >

          <header className="heading">
            <p>The Ultimate</p>
            <h1>COLLECTIONS</h1>
          </header>

          <div className="carousel-area home-stack">

            {products.map((product, index) => (
              <div
                className="home-card collection-card"
                key={index}
              >

                <img
                  src={product.image}
                  alt={product.name}
                />

              </div>
            ))}

          </div>

        </section>
      )}

      {/* =================================
          SECOND SCREEN - STACK CARDS
      ================================= */}

      {details && (
        <section
          className="details-page"
          ref={detailRef}
        >

          {/* BACK BUTTON - ADDED */}

          <button
            className="dark-button back-button"
            onClick={() => {
              setDetails(false);
              setSelected(0);
              setCart(false);
            }}
          >
            ← Back
          </button>

          <div className="details-layout">

            {/* STACK CARDS */}

            <div className="stack-area">

              {products.map((product, index) => (
                <div
                  className="detail-card"
                  key={index}
                >

                  <img
                    src={product.image}
                    alt={product.name}
                  />

                </div>
              ))}

            </div>

            {/* PRODUCT INFORMATION */}

            <div className="product-info">

              <h2>
                {products[selected].name}
              </h2>

              <h3>
                {products[selected].price}
              </h3>

              <button
                className="dark-button cart-button"
                onClick={addToCart}
              >
                Add to cart
              </button>

              {cart && (
                <p className="cart-message">
                  Added to cart
                </p>
              )}

            </div>

          </div>

        </section>
      )}

    </main>
  );
}