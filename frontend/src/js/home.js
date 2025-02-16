const ImageWithAnimation = () => {
    const imageRef = useRef(null);
  
    useEffect(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("visible"); // Add the `visible` class
            } else {
              entry.target.classList.remove("visible"); // Optional: Remove the class when out of view
            }
          });
        },
        { threshold: 0.5 } // Trigger when 50% of the image is visible
      );
  
      if (imageRef.current) {
        observer.observe(imageRef.current);
      }
  
      return () => {
        if (imageRef.current) {
          observer.unobserve(imageRef.current); // Cleanup observer
        }
      };
    }, []);}