import { useEffect, useState } from "react";

const CountUp = ({ end, duration = 1500 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime = null;
    let animationFrame;

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;

      const progress = currentTime - startTime;
      const percentage = Math.min(progress / duration, 1);
      const easeOut = percentage === 1 ? 1 : 1 - Math.pow(2, -10 * percentage);

      setCount(Math.floor(easeOut * end));

      if (progress < duration) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return <>{count}</>;
};

export default CountUp;
