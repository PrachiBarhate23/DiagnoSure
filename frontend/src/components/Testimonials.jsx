import React from "react";
import "./Testimonials.css";
import male from '../assets/male1.png';
import female from '../assets/feamle.png';

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: "Priya Sharma",
      feedback:
        "Diagnosure's AI symptom checker helped me understand my health concerns better. The prescription analysis feature is incredibly accurate and gives me peace of mind.",
      image: female,
    },
    {
      id: 2,
      name: "Aarav Mehta",
      feedback:
        "The seamless care coordination feature made it so easy to connect with my doctor. I love how everything is organized in one place for better health management.",
      image: male,
    },
    {
      id: 3,
      name: "Rohan Gupta",
      feedback:
        "Being part of the patient community has been life-changing. The support and shared experiences from others facing similar health challenges is invaluable.",
      image: male,
    },
    {
      id: 4,
      name: "Ananya Iyer",
      feedback:
        "The smart prescription analysis caught a potential drug interaction that my pharmacy missed. Diagnosure truly puts patient safety first with cutting-edge technology.",
      image:female,
    },
    {
      id: 5,
      name: "Dr. Rajesh Kumar",
      feedback:
        "As a physician, I'm impressed by how Diagnosure's AI assists in differential diagnosis. It helps me consider possibilities I might have overlooked, improving my diagnostic accuracy significantly.",
      image: male,
    },
    {
      id: 6,
      name: "Priyanka Gupta",
      feedback:
        "The symptom checker helped me understand when to seek emergency care versus when home treatment was appropriate. It saved me an unnecessary ER visit and gave me peace of mind.",
      image: female,
    },
  ];

  return (
    <section className="testimonials-section">
      <div className="testimonials-container">
        <h2 className="testimonials-heading hero-heading">
          What Our Users Say
        </h2>
        <div className="testimonials-grid">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="testimonial-card">
              <div className="testimonial-avatar">
                <img src={testimonial.image} alt={testimonial.name} />
              </div>
              <div className="testimonial-content">
                <p className="testimonial-feedback hero-subheading">
                  {testimonial.feedback}
                </p>
                <h4 className="testimonial-name">{testimonial.name}</h4>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
