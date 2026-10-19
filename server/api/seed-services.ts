import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.join(__dirname, '.env') });

import mongoose from 'mongoose';
import dns from 'dns';
import { ServiceCategory } from './src/models/ServiceCategory';
import { Service } from './src/models/Service';

dns.setServers(['8.8.8.8', '1.1.1.1']);

const categoriesData = [
  {
    name: {
      en: 'Industrial Medical Services',
      ar: 'الخدمات الطبية الصناعية',
    },
    slug: 'industrial-medical-services',
    description: {
      en: 'Specialized occupational health and comprehensive medical testing for industrial workforces.',
      ar: 'خدمات الصحة المهنية والفحوصات الطبية المتخصصة للمنشآت والمشاريع الصناعية.',
    },
    order: 1,
    services: [
      {
        name: {
          en: 'Pre-Employment Medical',
          ar: 'الفحص الطبي قبل التوظيف',
        },
        slug: 'pre-employment-medical',
        description: {
          en: 'Specialized pre-employment occupational health screening complying with corporate medical standards of major industrial partners.',
          ar: 'فحوصات طبية مهنية معتمدة قبل التوظيف متوافقة مع متطلبات ومعايير كبرى الشركات الصناعية.',
        },
        image: '/images/hospital/reception.jpg',
        associatedOrganizations: [
          'ARAMCO',
          'SABIC',
          'SAIPEM',
          'SADARA',
          'PETRORABIGH',
          'SAMSUNG',
        ],
        order: 1,
      },
    ],
  },
  {
    name: {
      en: 'Licensing Medical',
      ar: 'فحوصات التراخيص الطبية',
    },
    slug: 'licensing-medical',
    description: {
      en: 'Mandatory government health clearances linked directly to official regulatory platforms.',
      ar: 'الفحوصات الطبية الرسمية للتراخيص والإقامات المرتبطة مباشرة بالمنصات الحكومية.',
    },
    order: 2,
    services: [
      {
        name: {
          en: 'Iqama (Residency) Medical',
          ar: 'فحص الإقامة (إصدار وتجديد)',
        },
        slug: 'iqama-medical',
        description: {
          en: 'Official medical examination required for Saudi residency (Iqama) issuance and renewal, integrated with the Efada / Sehhaty digital platform.',
          ar: 'الفحص الطبي المعتمد لإصدار وتجديد الإقامة وربطه إلكترونياً وبشكل فوري عبر منصة إفادة وصحتي.',
        },
        image: '/images/hospital/entrance.jpg',
        order: 1,
      },
      {
        name: {
          en: 'Driving License Medical',
          ar: 'فحص رخصة القيادة',
        },
        slug: 'driving-license-medical',
        description: {
          en: 'Comprehensive medical fitness and visual acuity examination required for issuing or renewing driving licenses, linked directly with Moroor.',
          ar: 'فحص اللياقة والنظر المعتمد لإصدار وتجديد رخص القيادة وربطه فورياً بنظام المرور.',
        },
        image: '/images/hospital/emergency-ward.jpg',
        order: 2,
      },
    ],
  },
  {
    name: {
      en: 'Renewal Services',
      ar: 'خدمات التجديد الدوري',
    },
    slug: 'renewal-services',
    description: {
      en: 'Ongoing medical fitness assessments and continuous health monitoring programs.',
      ar: 'برامج الفحص الدوري ومتابعة اللياقة الطبية المستمرة لبيئات العمل المختلفة.',
    },
    order: 3,
    services: [
      {
        name: {
          en: 'Periodic (Renewal) Medical',
          ar: 'الفحص الطبي الدوري والتجديد',
        },
        slug: 'periodic-renewal-medical',
        description: {
          en: 'Ongoing medical fitness evaluations and periodic occupational screenings ensuring continuous workplace safety and wellness.',
          ar: 'فحوصات دورية للياقة الطبية والصحة المهنية لضمان سلامة وصحة العاملين المستمرة في مواقع العمل.',
        },
        image: '/images/hospital/exterior.jpg',
        order: 1,
      },
    ],
  },
  {
    name: {
      en: 'Specialized Services',
      ar: 'الخدمات الطبية المتخصصة',
    },
    slug: 'specialized-services',
    description: {
      en: 'Targeted health certifications for food handling, international travel, and religious pilgrimages.',
      ar: 'فحوصات وشهادات صحية نوعية لمتداولي الأغذية، المسافرين، وحجاج ومعتمري بيت الله الحرام.',
    },
    order: 4,
    services: [
      {
        name: {
          en: 'Food Handler Medical / Baladiya Card',
          ar: 'فحص متداولي الأغذية / كارت البلدية',
        },
        slug: 'food-handler-medical',
        description: {
          en: 'Certified health screening and infectious disease testing required for municipal Baladiya health cards for food handlers and hospitality staff.',
          ar: 'الفحوصات المخبرية والسريرية المعتمدة لاستخراج وتجديد الشهادات الصحية (كارت البلدية) لمتداولي الأغذية.',
        },
        image: '/images/hospital/reception.jpg',
        order: 1,
      },
      {
        name: {
          en: 'Travel Medical',
          ar: 'فحص السفر الطبي',
        },
        slug: 'travel-medical',
        description: {
          en: 'Comprehensive medical fitness tests, travel vaccinations, and health clearances required for international travel.',
          ar: 'فحوصات اللياقة الطبية الشاملة والتطعيمات الإلزامية وشهادات الخلو من الأمراض للمسافرين دولياً.',
        },
        image: '/images/hospital/entrance.jpg',
        order: 2,
      },
      {
        name: {
          en: 'Umrah / Hajj Medical',
          ar: 'فحص العمرة والحج',
        },
        slug: 'umrah-hajj-medical',
        description: {
          en: 'Health evaluations, physical fitness assessments, and required mandatory immunizations for pilgrims embarking on Umrah and Hajj.',
          ar: 'الفحوصات الطبية المعتمدة والتطعيمات الإلزامية لضيوف الرحمن من حجاج ومعتمري بيت الله الحرام.',
        },
        image: '/images/hospital/emergency-ward.jpg',
        order: 3,
      },
    ],
  },
  {
    name: {
      en: 'General Services',
      ar: 'الخدمات الطبية العامة',
    },
    slug: 'general-services',
    description: {
      en: 'Standard health checks and certifications for academic, athletic, and personal requirements.',
      ar: 'فحوصات وتقارير اللياقة الصحية للجامعات، الأندية الرياضية، والمتطلبات الشخصية والحكومية.',
    },
    order: 5,
    services: [
      {
        name: {
          en: 'Medical Fitness General',
          ar: 'اللياقة الطبية العامة',
        },
        slug: 'medical-fitness-general',
        description: {
          en: 'Complete general medical fitness evaluations for academic admissions, sports club memberships, government documentation, and personal verification.',
          ar: 'تقارير فحص اللياقة الطبية الشاملة للقبول الأكاديمي، الأندية الرياضية، وتوثيق المعاملات الرسمية.',
        },
        image: '/images/hospital/exterior.jpg',
        order: 1,
      },
    ],
  },
  {
    name: {
      en: 'International Services',
      ar: 'الخدمات الطبية الدولية',
    },
    slug: 'international-services',
    description: {
      en: 'Accredited international visa diagnostics and immigration medical documentation.',
      ar: 'الفحوصات الطبية والتقارير المخبرية المعتمدة لطلبات التأشيرات الدولية وتصاريح العمل.',
    },
    order: 6,
    services: [
      {
        name: {
          en: 'Visa Medical',
          ar: 'فحص التأشيرات الطبية الدولية',
        },
        slug: 'visa-medical',
        description: {
          en: 'Accredited medical screening protocols, lab diagnostics, and certified reports for international visa applications and work permits.',
          ar: 'بروتوكولات فحص معتمدة وتشخيصات مخبرية متقدمة لطلبات التأشيرات وتصاريح العمل الدولية.',
        },
        image: '/images/hospital/reception.jpg',
        order: 1,
      },
    ],
  },
];

async function seed() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/salamatek';

  console.log('Connecting to MongoDB...');
  await mongoose.connect(uri);
  console.log('Connected.');

  for (const catData of categoriesData) {
    const { services, ...catFields } = catData;

    let category = await ServiceCategory.findOne({ slug: catFields.slug });
    if (!category) {
      category = await ServiceCategory.create(catFields);
      console.log(`Created category: ${catFields.name.en}`);
    } else {
      category.name = catFields.name;
      category.description = catFields.description;
      category.order = catFields.order;
      await category.save();
      console.log(`Updated category: ${catFields.name.en}`);
    }

    for (const srvData of services) {
      let service = await Service.findOne({ slug: srvData.slug });
      if (!service) {
        service = await Service.create({
          ...srvData,
          categoryId: category._id,
          active: true,
        });
        console.log(`  + Created service: ${srvData.name.en}`);
      } else {
        service.name = srvData.name;
        service.description = srvData.description;
        service.categoryId = category._id;
        service.order = srvData.order;
        if ((srvData as any).associatedOrganizations) {
          service.associatedOrganizations = (srvData as any).associatedOrganizations;
        }
        await service.save();
        console.log(`  * Updated service: ${srvData.name.en}`);
      }
    }
  }

  console.log('Finished seeding categories and services successfully!');
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('Seeding error:', err);
  process.exit(1);
});
