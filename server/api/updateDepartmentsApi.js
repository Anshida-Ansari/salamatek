// Using native fetch

const departmentsData = [
  {
    nameEn: "DIABETES",
    subheading: "Scared of becoming a diabetic??...Our recommendations suggest lower risk levels!!",
    description: "At our facility, we provide an exclusive range of recommendations and care for various types of diabetes. Our exclusive Diabetes Research Center helps us to offer a clear cut visibility on the patterns and prevalence of chronic complications using appropriate parameters."
  },
  {
    nameEn: "GYNAECOLOGY",
    subheading: "Healthy the Mother, Healthier the Child…Mother & Baby care at its Best!!",
    description: "At Salamatek, our team of gynaec experts offer round-the-clock quality medical care to gynaec patients. Our tender treatment approach especially to carrying women and new- borns grab a higher notch. The Gynaecology Department is equipped with first-class facilities and up-to-date medical equipments for foetal monitoring backed by extensive facilities for ensuring quality care; hence rendering over-all care for both mother and the new-born."
  },
  {
    nameEn: "ORTHOPAEDICS",
    subheading: "Finding difficult to climb stairs?....Joint ailments and pain grown to be a part of your life?? But, not anymore!!",
    description: "Slamatek Hospital offers one of the finest premier facilities for orthopaedic surgical care and other related ailments. The ultra-modern medical facilities and equipments coupled with highly efficient and eminent experts specialized in orthopaedic field provide better surgical and post-operative medical care to our patients. It also provides one of the best trauma care units on a 24/7 basis."
  },
  {
    nameEn: "ENT",
    subheading: "Ear, Nose and Throat Disorders…Heal it the best way!!",
    description: "Our panel of experts focus on innovative and cutting-edge treatments and procedures on ear, nose and throat related issues and offer reliable treatable and curable solutions. We deal with all phases of ENT procedures. Besides this, the department also specializes in offering a wide range of ENT services including adult and paediatric ENT special care and treatment solutions."
  },
  {
    nameEn: "OPHTHALMOLOGY",
    subheading: "Your eyes open up to a wonderful world…Give them the care they want!!",
    description: "At Salamatek, the Department of Ophthalmology brings to you one of the best Ophthalmology experts. It also offers a dedicated channel for screening, diagnostic and surgical eye technology solutions and services\n\nThe multi-speciality bunch of clinical, surgical and research consultants work in a collaborative environment and use advanced technologies to render better services to the patients in need. We put into play the best of recommended practices for eye care and handle most complex cases in the best possible manner."
  },
  {
    nameEn: "PAEDIATRICS",
    subheading: "Child is the father of man…Ensure your child gets the best environment to grow!!",
    description: "The Salamatek Children's clinical care center is designed with ultra-modern medical infrastructure with extreme focus on kid-friendly environment and family-oriented care. \nOur panel of expert paediatric professionals resort to advanced diagnostic and medical techniques to render care for children of all ages."
  },
  {
    nameEn: "DERMATOLOGY & COSMETOLOGY",
    subheading: "",
    description: "Expert panel comprising the Dermatology speciality provides treatment for patients with a wide spread range of skin conditions; ranging from common issues viz; acne to critical skin problems that affect patients with weaker immune systems.\n\nOur dermatologist experts are also extensively considered for their vast expertise in using the best promising advanced technologies and practices to avert and treat deadly conditions.\nWe at Salamatek, Department of Dermatology, we offer a complete range of services for patients with skin disorders including acne, eczema, dermatitis, psoriasis, hair loss, warts, and pigmentation. Our Department of Dermatology is dedicated to providing individualized treatment in a professional and caring environment. Our doctors specialized in the diagnosis and treatment of skin problems across all age groups. They bring a wealth of expertise and experience to help maintain your skin health. Our specialized cosmetology procedures include GentleLase Treatment, Fractional Laser, Hydrafacial Treatment, Spectra Laser etc"
  },
  {
    nameEn: "ORTHODONTICS",
    subheading: "No two smiles ever match…That’s why we render specialized Orthodontic care!!",
    description: "We, at Salamatek, offer an extensive range of customized care for patients engrossed on their unique orthodontic needs. We use high-end technology equipments and techniques to articulate a tailor stitched approach to fit into your comfort. We also put forth an array of advanced treatment methodologies and facilities to bring up the perfect smile on your face."
  },
  {
    nameEn: "Family Medicine",
    subheading: "",
    description: "At our Department of Family Medicine, we cater to the management of a wide range of conditions both common and acute medical illnesses. The Department is well equipped to manage chronic health conditions such as diabetes, hypertension, lifestyle and obesity, thyroid disorders, lipid abnormalities and various febrile illnesses like, respiratory infections, joint pains etc. Our dedicated team of Physicians ensure that our patients get the best treatment possible and superior care."
  },
  {
    nameEn: "GENERAL MEDICINE",
    subheading: "Hale and hearty lifestyle habits…Lead a healthy life!!",
    description: "Salamatek provides a widespread and an all-inclusive multidisciplinary approach to care and treatment of the patients. We deliver the finest endurance and care for our patients by ensuring primary care and treatment services. Our highly dedicated service delivery model is acknowledged as the key physician care model for geriatric and chronically ill patient, in particular.\nOur General Physician experts have a broad range of knowledge and are capable to decide on the best appropriate medical investigations to undertake to confirm their clinical suspicions."
  },
  {
    nameEn: "DENTAL",
    subheading: "A smile costs nothing…Do your best to keep up your smile!!",
    description: "Salamatek Hospital provides you with a sparkling smile on your face at affordable rates in a comfortable, advanced and stress-free ambience. We bring to you a whole new experience in dental treatment and care by introducing latest technologies which paves way for painless surgeries, relatively lesser operational time period and minimum consultations with specialists while maintaining highest quality standards.\nSalamatek Dental Specialists offers advanced technology integrated Dental Clinic specializing in Prosthodontics, Periodontology, Implantology and Aesthetic Dentistry."
  },
  {
    nameEn: "RADIOLOGY",
    subheading: "Life offers second chances…Why not take it Safely??",
    description: "At Salamatek, we have a full-fledged Radiology Wing equipped with advanced and ultra-modern imaging technology and has an innovative and advanced imaging centre in place.\nThe Radiology & Imaging specialists at Salamatek are highly skilled professionals trained in performing complex procedures."
  },
  {
    nameEn: "PATHOLOGY",
    subheading: "One can’t avoid pathogens in their day-to-day life…But hygiene and cleanliness can do the job!!",
    description: "The Pathology Department at Salamatek has advanced and well-equipped systems to carry out desired clinical tests on patients and offers a supportive and relaxed environment to assist clinicians in examination and diagnosis of diseases. Thorough tests conducted by lab experts using high-tech medical equipments help to diagnose diseases with much ease and recommend best possible affordable treatment."
  },
  {
    nameEn: "PHYSIOTHERAPY",
    subheading: "",
    description: "The Department of Physiotherapy at Salamatek Medical Center is equipped with advanced machineries and a highly experienced team of physiotherapists. We offer a multifaceted approach to our patient’s rehabilitation by providing treatment as per international standards. We provide comprehensive assessment to rule out the cause of pain or injury along with reviewing past medical history and developing a personalised therapy plan to meet the functional goals that includes exercises to restore function, relieve pain and improve mobility."
  },
  {
    nameEn: "PHARMACY",
    subheading: "",
    description: "Our pharmacy functions 24/7, so that patients always find it convenient to purchase medicines at any moment of time. The Pharmacy is well stocked with a wide range of medicines produced by worldwide pharmaceutical companies. Our patients are being served by highly qualified and experienced Pharmacists that works."
  },
  {
    nameEn: "SALAMATEK OPTICALS",
    subheading: "",
    description: "Salamatek Optical is committed to provide you with the supreme product selections, as well as high-quality eye care services that will prove their value day by day. We can definitely meet your eye care needs. Our showroom offers immense number of Sun glasses and frames from top brands in the market to fit various customer needs, and we provide quality service and competitive pricing that keep our customers coming back."
  },
  {
    nameEn: "SARC",
    subheading: "",
    description: "SARC is a division of Salamatek Medical Center. At SARC, we simplify the health care services at work sites by providing qualified Doctors, Nurses, Paramedical Staff, Ambulance Services and other Medical services to create an effective medical healthcare environment at work sites that meet the needs of our client companies."
  }
];

async function updateAPI() {
  try {
    const res = await fetch('http://localhost:5000/api/departments?limit=50');
    if (!res.ok) throw new Error('Failed to fetch departments: ' + res.status);
    const json = await res.json();
    const existingDepts = json.data;
    
    for (const d of departmentsData) {
      const match = existingDepts.find(x => x.name.en.toLowerCase() === d.nameEn.toLowerCase());
      if (match) {
        console.log('Updating: ' + d.nameEn);
        const payload = {
          subheading: { en: d.subheading, ar: match.subheading?.ar || '' },
          description: { en: d.description, ar: match.description?.ar || '' }
        };
        const updateRes = await fetch(`http://localhost:5000/api/departments/${match._id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!updateRes.ok) console.error('Failed to update ' + d.nameEn);
      } else {
        console.log('Creating: ' + d.nameEn);
        const payload = {
          name: { en: d.nameEn, ar: d.nameEn },
          slug: d.nameEn.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
          subheading: { en: d.subheading, ar: '' },
          description: { en: d.description, ar: '' },
          active: true
        };
        const createRes = await fetch(`http://localhost:5000/api/departments`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (!createRes.ok) {
           const errText = await createRes.text();
           console.error('Failed to create ' + d.nameEn + ' ' + errText);
        }
      }
    }
    console.log('Done!');
  } catch(e) {
    console.error(e);
  }
}
updateAPI();
