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
    image: `${import.meta.env.BASE_URL}images/bangel.png`,
  },
  {
    name: "Diamond Earrings",
    price: "₹39,999",
    image: `${import.meta.env.BASE_URL}images/earing.png`,
  },
  {
    name: "Golden Necklace",
    price: "₹89,999",
    image: `${import.meta.env.BASE_URL}images/neckles.png`,
  },
  {
    name: "Diamond Ring",
    price: "₹29,999",
    image: `${import.meta.env.BASE_URL}images/ring.png`,
  },
  {
    name: "Golden Chain",
    price: "₹59,999",
    image: `${import.meta.env.BASE_URL}images/chain.png`,
  },
  {
    name: "Traditional Jhumka",
    price: "₹29,999",
    image: `${import.meta.env.BASE_URL}images/jhumka.png`,
  },
  {
    name: "Crystal Necklace",
    price: "₹99,999",
    image: `${import.meta.env.BASE_URL}images/crystal.png`,
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
  // HOME CARD SPREAD
  // =================================

  useLayoutEffect(() => {
    if (details || !homeRef.current) return;

    const cards = gsap.utils.toArray(
      homeRef.current.querySelectorAll(".home-card")
    );

    if (!cards.length) return;

    const centerIndex = Math.floor(cards.length / 2);

    const ctx = gsap.context(() => {
      // Heading animation

      gsap.from(".heading", {
        y: -35,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      });

      // Initial position

      gsap.set(cards, {
        x: 0,
        y: 0,
        scale: 0.85,
        rotation: 0,
        opacity: 1,
        zIndex: (i) =>
          50 - Math.abs(i - centerIndex),
      });

      // Center card

      gsap.set(cards[centerIndex], {
        scale: 1.12,
        zIndex: 100,
      });

      // Spread positions

      const positions = [
        -510,
        -340,
        -170,
        0,
        170,
        340,
        510,
      ];

      const verticalPositions = [
        15,
        5,
        -5,
        0,
        -5,
        5,
        15,
      ];

      const rotations = [
        -3,
        -2,
        -1,
        0,
        1,
        2,
        3,
      ];

      gsap.to(cards, {
        x: (i) => positions[i],
        y: (i) => verticalPositions[i],
        scale: (i) =>
          i === centerIndex ? 1.12 : 1,
        rotation: (i) => rotations[i],
        zIndex: (i) =>
          i === centerIndex
            ? 100
            : 50 - Math.abs(i - centerIndex),
        duration: 1.5,
        stagger: 0,
        ease: "power3.out",
      });
    }, homeRef);

    return () => ctx.revert();
  }, [details]);

  // =================================
  // DETAIL STACK INITIAL ANIMATION
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
      // Stack cards

      gsap.set(cards, {
        x: (i) => i * 8,
        y: (i) => i * 5,
        rotation: (i) => i * 1.2,
        scale: (i) => 1 - i * 0.012,
        opacity: 1,
        zIndex: (i) => cards.length - i,
      });

      // Selected card comes to front

      gsap.set(cards[selected], {
        x: 0,
        y: 0,
        rotation: 0,
        scale: 1,
        zIndex: 200,
      });

      // Product info

      gsap.fromTo(
        info,
        {
          opacity: 0,
          x: 45,
        },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: "power3.out",
        }
      );
    }, detailRef);

    return () => ctx.revert();
  }, [details]);

  // =================================
  // CHANGE STACK CARD
  // =================================

  const changeCard = (newIndex) => {
    if (!detailRef.current) return;

    const cards = gsap.utils.toArray(
      detailRef.current.querySelectorAll(".detail-card")
    );

    if (!cards.length) return;

    const oldIndex = selected;

    if (newIndex === oldIndex) return;

    const oldCard = cards[oldIndex];
    const newCard = cards[newIndex];

    // Update selected product

    setSelected(newIndex);
    setCart(false);

    // New card comes front

    gsap.to(newCard, {
      x: 0,
      y: 0,
      scale: 1,
      rotation: 0,
      zIndex: 200,
      duration: 0.7,
      ease: "back.out(1.4)",
    });

    // Old card moves back

    gsap.to(oldCard, {
      x: newIndex > oldIndex ? 28 : -28,
      y: 18,
      scale: 0.91,
      rotation: newIndex > oldIndex ? 4 : -4,
      zIndex: 50,
      duration: 0.55,
      ease: "power2.inOut",
    });

    // Keep remaining cards stacked

    cards.forEach((card, index) => {
      if (
        index !== oldIndex &&
        index !== newIndex
      ) {
        gsap.to(card, {
          x: index * 8,
          y: index * 5,
          scale: 1 - index * 0.012,
          rotation: index * 1.2,
          duration: 0.5,
          ease: "power2.out",
        });
      }
    });
  };

  // =================================
  // NEXT CARD
  // =================================

  const nextCard = () => {
    const nextIndex =
      (selected + 1) % products.length;

    changeCard(nextIndex);
  };

  // =================================
  // PREVIOUS CARD
  // =================================

  const previousCard = () => {
    const previousIndex =
      (selected - 1 + products.length) %
      products.length;

    changeCard(previousIndex);
  };

  // =================================
  // HOME CARD SELECT
  // =================================

  const handleHomeSelect = (index) => {
    setSelected(index);
    setCart(false);
    setDetails(true);
  };

  // =================================
  // STACK CARD DIRECT SELECT
  // =================================

  const handleStackSelect = (index) => {
    changeCard(index);
  };

  // =================================
  // ADD TO CART
  // =================================

  const addToCart = () => {
    setCart(true);
  };

  // =================================
  // BACK
  // =================================

  const handleBack = () => {
    setDetails(false);
    setSelected(0);
    setCart(false);
  };

  // =================================
  // JSX
  // =================================

  return (
    <main className="app">

      {/* =================================
          HOME PAGE
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
                className={`home-card collection-card ${
                  selected === index
                    ? "selected-card"
                    : ""
                }`}
                key={index}
                onClick={() =>
                  handleHomeSelect(index)
                }
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
          DETAILS PAGE
      ================================= */}

      {details && (
        <section
          className="details-page"
          ref={detailRef}
        >

          {/* BACK */}

          <button
            className="dark-button back-button"
            onClick={handleBack}
          >
            ← Back
          </button>

          <div className="details-layout">

            {/* =================================
                STACK
            ================================= */}

            <div className="stack-area">

              {products.map((product, index) => (
                <div
                  className={`detail-card ${
                    selected === index
                      ? "selected-card"
                      : ""
                  }`}
                  key={index}
                  onClick={() =>
                    handleStackSelect(index)
                  }
                >

                  <img
                    src={product.image}
                    alt={product.name}
                  />

                </div>
              ))}

              {/* =================================
                  ARROWS
              ================================= */}

              <button
                className="stack-arrow stack-arrow-left"
                onClick={previousCard}
                aria-label="Previous product"
              >
                ←
              </button>

              <button
                className="stack-arrow stack-arrow-right"
                onClick={nextCard}
                aria-label="Next product"
              >
                →
              </button>

            </div>

            {/* =================================
                PRODUCT INFO
            ================================= */}

            <div className="product-info">

              <p className="product-number">
                {String(selected + 1).padStart(2, "0")} /{" "}
                {String(products.length).padStart(2, "0")}
              </p>

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