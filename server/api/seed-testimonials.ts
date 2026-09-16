import mongoose from 'mongoose';
import { Testimonial } from './src/models/Testimonial';

const MONGODB_URI = 'mongodb+srv://anshidaansari9a_db_user:xQ54tw3q2l4ex1e3@cluster0.cqzayio.mongodb.net/?appName=Cluster0';

const reviews = [
  {
    name: { en: 'Rochelle Sagun', ar: 'روشيل ساجون' },
    rating: 5,
    text: {
      en: 'I had a very good experience at Salamatek Medical Center. The staff were friendly, accommodating, and professional, and the doctors were excellent. A special mention to Dr. Hana—she is very knowledgeable in her specialty, precise when giving diagnoses, and thorough when explaining treatment options. She is also very skilled in sonography and made me feel comfortable throughout the process. Overall, I’m very satisfied with the care I received and would highly recommend Salamatek Medical Center to anyone looking for knowledgeable and compassionate healthcare professionals.',
      ar: 'لقد حظيت بتجربة جيدة جدًا في مركز سلامتك الطبي. كان الموظفون ودودين ومتعاونين ومحترفين، وكان الأطباء ممتازين. أذكر بشكل خاص الدكتورة هناء - فهي على دراية واسعة بتخصصها، ودقيقة عند إعطاء التشخيص، وشاملة عند شرح خيارات العلاج. كما أنها ماهرة جدًا في التصوير بالموجات فوق الصوتية وجعلتني أشعر بالراحة طوال العملية. بشكل عام، أنا راضية جدًا عن الرعاية التي تلقيتها وأوصي بشدة بمركز سلامتك الطبي لأي شخص يبحث عن متخصصين في الرعاية الصحية ذوي معرفة وتعاطف.'
    }
  },
  {
    name: { en: 'Azhar Hussain', ar: 'أزهر حسين' },
    rating: 5,
    text: {
      en: 'Excellent experience with Mr. Riyan for my facial laser treatment. He was very professional, friendly, and explained everything clearly. I’m very happy with the service and results. Highly recommended!',
      ar: 'تجربة ممتازة مع السيد ريان لعلاج الليزر للوجه. كان محترفًا للغاية، ودودًا، وشرح كل شيء بوضوح. أنا سعيد جدًا بالخدمة والنتائج. موصى به بشدة!'
    }
  },
  {
    name: { en: 'earl vann orines', ar: 'إيرل فان أورينس' },
    rating: 5,
    text: {
      en: 'Doctor Ibrahim has a very great service and skill in Surgery. Professional and knowledgeable about the proper procedures, accurate diagnosis and also very accommodating.',
      ar: 'الدكتور إبراهيم يقدم خدمة عظيمة ومهارة عالية في الجراحة. محترف وعلى دراية تامة بالإجراءات الصحيحة، تشخيص دقيق ومتعاون جداً.'
    }
  },
  {
    name: { en: 'Reema Alghoul', ar: 'ريما الغول' },
    rating: 5,
    text: {
      en: 'I had a great experience at the medical complex, and I would especially like to thank the coordinator (Ms, Donia) for her outstanding professionalism. She was very organized, responsive, and supportive throughout the entire process. Her friendly attitude and attention to detail made everything smooth and stress-free. Truly a 5-star service.',
      ar: 'لقد حظيت بتجربة رائعة في المجمع الطبي، وأود أن أشكر بشكل خاص المنسقة (السيدة دنيا) على احترافيتها المتميزة. كانت منظمة للغاية، سريعة الاستجابة، وداعمة طوال العملية بأكملها. موقفها الودود واهتمامها بالتفاصيل جعل كل شيء سلساً وخالياً من التوتر. حقاً خدمة 5 نجوم.'
    }
  },
  {
    name: { en: 'Paul Ubaid', ar: 'بول عبيد' },
    rating: 5,
    text: {
      en: 'I had a good experience at the emergency dept.The staff were friendly professional and polite and i receved good care. Overall am satisfied with the service ...would recommend the hospital for emergency care',
      ar: 'لقد حظيت بتجربة جيدة في قسم الطوارئ. كان الموظفون ودودين محترفين ومهذبين وتلقيت رعاية جيدة. بشكل عام أنا راضٍ عن الخدمة... سأوصي بالمستشفى لرعاية الطوارئ'
    }
  },
  {
    name: { en: 'Anil Lamichhane', ar: 'أنيل لاميتشاني' },
    rating: 5,
    text: {
      en: 'The reception staff is arranged, their work is fast, and each floor has an employee, and this indicates the speed of service, and special thanks to the reception supervisor, Um Abdullah',
      ar: 'طاقم الاستقبال منظم، عملهم سريع، ولكل طابق موظف، وهذا يدل على سرعة الخدمة، وشكر خاص لمشرفة الاستقبال أم عبد الله'
    }
  },
  {
    name: { en: 'Imran Bashir', ar: 'عمران بشير' },
    rating: 5,
    text: {
      en: 'Exceptional care and professionalism. Salamatek Medical Centre stands out for its well-trained staff, modern facilities, and patient-first approach. Every visit is met with efficiency, compassion, and high medical standards. A trusted healthcare provider in the Safwa region—highly recommended.',
      ar: 'رعاية استثنائية واحترافية. يبرز مركز سلامتك الطبي بطاقمه المدرب تدريباً جيداً، ومرافقه الحديثة، ونهجه الذي يضع المريض في المقام الأول. تقابل كل زيارة بالكفاءة والتعاطف والمعايير الطبية العالية. مزود رعاية صحية موثوق به في منطقة صفوى - موصى به بشدة.'
    }
  }
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Clear existing testimonials
    await Testimonial.deleteMany({});
    console.log('Cleared existing testimonials');
    
    // Insert new reviews
    await Testimonial.insertMany(reviews);
    console.log('Successfully seeded 7 testimonials');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding testimonials:', error);
    process.exit(1);
  }
}

seed();
