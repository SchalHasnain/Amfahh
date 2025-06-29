import React, { useState } from 'react';

const TEAM_MEMBERS = [
  {
    name: 'Dr. Homa Hussain',
    title: 'Chief Executive',
    image: '/images/humaira.jpg',
    linkedin: 'https://www.linkedin.com/in/homa-hussain-44120b371',
    details: `<strong>Our Chief Executive Officer: Dr. Homa Hussain</strong><br/><br/>
Leading Amfahh Dental & Surgical Instruments as our Chief Executive Officer is Dr. Homa Hussain. With a remarkable 35 years of experience in the medical field, Dr. Homa Hussain brings a comprehensive and unique blend of expertise to our organization.<br/><br/>
Dr. Homa Hussain is a highly qualified professional, holding an MBBS (Pb) and MPDSC (East Africa), and is a registered RMP. Beyond her foundational medical training, she is also a skilled General Practitioner, Nutritionist, and possesses significant expertise in alternative medicine, offering a holistic perspective to healthcare.<br/><br/>
Her extensive career includes impactful roles such as being the Ex-In-Charge of the Community Welfare Clinic at PARCO MCR and the In-charge of the Social Security Clinic Khewra. She has also served as a Private Consultant at SKS Clinic, Lahore, Pakistan, and as a Consultant at Rasheed Akhtar Hospital.<br/><br/>
Dr. Hussain's vast experience in diverse medical settings, coupled with her broad medical knowledge and leadership capabilities, is instrumental in steering Amfahh towards its vision of providing top-tier dental and surgical instruments and fostering excellence in global healthcare.`
  },
  {
    name: 'Dr. Rashid Khan',
    title: 'Chief Advisor',
    image: '/images/rashid.jpg',
    linkedin: 'https://www.linkedin.com/in/muhammad-khan-3a58b946',
    details: `<strong>We are honored to have Dr. Muhammad Rashid Khan serve as the Chief Advisor for Amfahh Dental & Surgical Instruments.</strong> With an impressive career spanning 35 years in the medical field, Dr. Khan brings a wealth of experience, profound expertise, and invaluable insights to our team.<br/><br/>
<strong>Qualifications:</strong> MBBS (Pb), MPDSC (East Africa), Dip OH (Ireland), Ph.D. (Colombo, Sri Lanka).<br/><br/>
Dr. Khan's extensive qualifications include an MBBS (Pb), MPDSC (East Africa), Dip OH (Ireland), and a Ph.D. from Colombo (Sri Lanka). He is a highly respected Medical Specialist and Diabetologist, renowned for his deep understanding of patient care and medical administration.<br/><br/>
<strong>Career Highlights:</strong> Led the medical department at Parco (a refinery site in Pakistan) for nine years, a decade as Head of Medical Department at ICI Pakistan, and Managing Director of Rasheed Akhtar Hospital, Lahore.<br/><br/>
<strong>Education & Advocacy:</strong> Speaker for Novo Nordisk, public health educator via YouTube channel "Sugar Ka Safar".<br/><br/>
Dr. Khan's guidance ensures that Amfahh remains at the forefront of providing the highest quality dental and surgical instruments, deeply rooted in real-world medical needs and clinical excellence.`
  },
  {
    name: 'Hasnain Rafiq',
    title: 'Head of Operations & Marketing',
    image: '/images/hasnain.jpg',
    linkedin: 'https://www.linkedin.com/in/hasnain-rafiq-684b3b4b',
    details: `<strong>We are proud to introduce Hasnain Rafiq, the Operational Head & Head of Marketing at Amfahh Dental & Surgical Instruments.</strong> With over 15 years of results-driven experience in the UAE, he is a seasoned operations professional with a proven track record of optimizing business processes. He specializes in transforming inefficiencies into competitive advantages, a skill set honed through extensive work in banking operations, project delivery, and governance frameworks.<br/><br/>
<strong>Expertise:</strong> Streamlining processes, driving strategic growth, operational excellence, and marketing.<br/><br/>
Mr. Hasnain's expertise lies in his ability to streamline complex processes and drive strategic growth. His dual role at Amfahh is pivotal; he ensures our operations run with maximum efficiency while simultaneously spearheading our marketing initiatives to reach healthcare professionals globally. His deep understanding of operational excellence, combined with his strategic marketing insights, is key to Amfahh's mission of delivering high-quality instruments with exceptional service and ensuring that our commitment to quality is matched by operational excellence and a customer-focused approach, making Amfahh a reliable and efficient partner for all our clients.<br/><br/>
Beyond his professional endeavors, he is also a passionate Climate Change Advocate. He actively contributes to raising awareness and sharing vital information on climate-related issues by writing insightful articles on LinkedIn, demonstrating his commitment to a sustainable future.`
  }
];

const Team = () => {
  const [selected, setSelected] = useState(null);
  
  const handleOpen = idx => setSelected(idx);
  const handleClose = () => setSelected(null);

  return (
    <section className="py-5">
      <div className="container">
        <div className="row justify-content-center mb-5">
          <div className="col-lg-8 text-center">
            <h2 className="fw-bold mb-3 text-primary" data-aos="fade-up">Our Leadership Team</h2>
            <p className="lead" data-aos="fade-up" data-aos-delay="200">
              Meet the experienced professionals who guide our company
            </p>
          </div>
        </div>
        <div className="row justify-content-center g-4">
          {TEAM_MEMBERS.map((member, idx) => (
            <div className="col-lg-4 col-md-6 d-flex align-items-stretch" key={member.name} data-aos="fade-up" style={{ minWidth: 300 }}>
              <div className="card shadow w-100 text-center border-0" style={{ borderRadius: '1.5rem' }}>
                <div style={{ cursor: 'pointer' }} onClick={() => handleOpen(idx)}>
                  <img src={member.image} alt={member.name} className="card-img-top mx-auto d-block" style={{ width: 180, height: 180, objectFit: 'cover', borderRadius: '50%', marginTop: 32 }} />
                  <div className="card-body">
                    <h5 className="fw-bold mb-1 text-primary" style={{ cursor: 'pointer' }}>{member.name}</h5>
                    <div className="mb-2 text-muted">{member.title}</div>
                  </div>
                </div>
                {/* Social icons: Only LinkedIn, no Twitter */}
                <div className="mb-3">
                  <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="me-2"><i className="fab fa-linkedin fa-lg"></i></a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal for details */}
        {selected !== null && (
          <div className="modal fade show d-block" tabIndex="-1" style={{ background: 'rgba(0,0,0,0.4)' }}>
            <div className="modal-dialog modal-dialog-centered modal-lg" style={{ minWidth: 600, maxWidth: 800 }}>
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title text-primary fw-bold">{TEAM_MEMBERS[selected].name}</h5>
                  <button type="button" className="btn-close" onClick={handleClose}></button>
                </div>
                <div className="modal-body">
                  <div className="text-center mb-3">
                    <img src={TEAM_MEMBERS[selected].image} alt={TEAM_MEMBERS[selected].name} style={{ width: 120, height: 120, objectFit: 'cover', borderRadius: '50%' }} />
                    <div className="fw-bold mt-2 text-muted">{TEAM_MEMBERS[selected].title}</div>
                  </div>
                  <div style={{ textAlign: 'left' }} dangerouslySetInnerHTML={{ __html: TEAM_MEMBERS[selected].details }} />
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={handleClose}>Close</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Team;