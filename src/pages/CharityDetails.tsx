import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Heart, ExternalLink, MapPin, Calendar, Users, TrendingUp, 
  ArrowLeft, ArrowRight, Target, Award, Globe, Mail, Phone 
} from 'lucide-react';
import { useCurrency } from '../contexts/CurrencyContext';

const CharityDetails: React.FC = () => {
  const { id } = useParams();
  const { formatPrice } = useCurrency();

  // Mock charity data - in real app, this would come from API
  const charityData: { [key: string]: any } = {
    '1': {
      id: '1',
      name: 'Education for All',
      description: 'Providing quality education to underprivileged children worldwide through innovative programs and technology.',
      longDescription: 'Education for All is a global initiative dedicated to breaking the cycle of poverty through education. We work in over 50 countries to provide access to quality learning opportunities for children who need it most. Our programs include building schools, training teachers, providing educational materials, and implementing technology solutions in remote areas.',
      category: 'Education',
      website: 'https://educationforall.org',
      location: 'Global',
      totalReceived: 125000,
      beneficiaries: 15000,
      projectsCompleted: 45,
      image: 'https://images.pexels.com/photos/1720186/pexels-photo-1720186.jpeg?auto=compress&cs=tinysrgb&w=800',
      founded: 2015,
      isActive: true,
      mission: 'To ensure every child has access to quality education regardless of their economic background or geographic location.',
      vision: 'A world where education is a fundamental right accessible to all children, empowering them to break the cycle of poverty.',
      contact: {
        email: 'info@educationforall.org',
        phone: '+1 (555) 123-4567',
        address: '123 Education Street, Learning City, LC 12345'
      },
      programs: [
        {
          name: 'School Building Initiative',
          description: 'Constructing schools in remote areas where children have no access to education.',
          impact: '25 schools built, 5,000 children enrolled'
        },
        {
          name: 'Teacher Training Program',
          description: 'Training local teachers to provide quality education in their communities.',
          impact: '500 teachers trained, 10,000 students impacted'
        },
        {
          name: 'Digital Learning Platform',
          description: 'Providing tablets and internet access for remote learning.',
          impact: '2,000 tablets distributed, 8,000 students connected'
        }
      ],
      recentUpdates: [
        {
          date: '2025-01-10',
          title: 'New School Opens in Rural Kenya',
          content: 'Thanks to your donations, we opened our 25th school, providing education to 200 children in rural Kenya.'
        },
        {
          date: '2025-01-05',
          title: 'Teacher Training Program Expansion',
          content: 'We have expanded our teacher training program to include 3 new regions, training 50 additional teachers.'
        },
        {
          date: '2024-12-28',
          title: 'Year-End Impact Report',
          content: 'In 2024, we reached 15,000 children across 50 countries, exceeding our annual goal by 25%.'
        }
      ],
      gallery: [
        'https://images.pexels.com/photos/1720186/pexels-photo-1720186.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/1205651/pexels-photo-1205651.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/1720186/pexels-photo-1720186.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/159844/cellular-education-classroom-159844.jpeg?auto=compress&cs=tinysrgb&w=400'
      ]
    },
    '2': {
      id: '2',
      name: 'Habitat for Humanity',
      description: 'Building homes and communities for families in need, creating a world where everyone has a decent place to live.',
      longDescription: 'Habitat for Humanity brings people together to build homes, communities and hope. We work alongside families to help them build or improve a place they can call home. Habitat homeowners help build their own homes alongside volunteers and pay an affordable mortgage.',
      category: 'Housing',
      website: 'https://habitat.org',
      location: 'Worldwide',
      totalReceived: 98500,
      beneficiaries: 8500,
      projectsCompleted: 120,
      image: 'https://images.pexels.com/photos/1370704/pexels-photo-1370704.jpeg?auto=compress&cs=tinysrgb&w=800',
      founded: 1976,
      isActive: true,
      mission: 'Seeking to put God\'s love into action, Habitat for Humanity brings people together to build homes, communities and hope.',
      vision: 'A world where everyone has a decent place to live.',
      contact: {
        email: 'info@habitat.org',
        phone: '+1 (555) 987-6543',
        address: '456 Building Avenue, Construction City, CC 67890'
      },
      programs: [
        {
          name: 'Home Building Program',
          description: 'Building affordable homes for families in need of decent shelter.',
          impact: '120 homes built, 480 people housed'
        },
        {
          name: 'Home Repair Program',
          description: 'Helping existing homeowners repair and improve their homes.',
          impact: '200 homes repaired, 800 people helped'
        },
        {
          name: 'Disaster Response',
          description: 'Providing emergency shelter and rebuilding after natural disasters.',
          impact: '50 emergency shelters, 300 families assisted'
        }
      ],
      recentUpdates: [
        {
          date: '2025-01-08',
          title: 'Community Build Day Success',
          content: 'Over 100 volunteers came together to build 3 homes in one day, showcasing the power of community.'
        },
        {
          date: '2025-01-03',
          title: 'Hurricane Recovery Efforts',
          content: 'Our disaster response team has helped 50 families rebuild after the recent hurricane season.'
        }
      ],
      gallery: [
        'https://images.pexels.com/photos/1370704/pexels-photo-1370704.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/1370704/pexels-photo-1370704.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg?auto=compress&cs=tinysrgb&w=400'
      ]
    },
    '3': {
      id: '3',
      name: 'Warmth for All',
      description: 'Providing clothing and shelter for homeless individuals and families during harsh weather conditions.',
      longDescription: 'Warmth for All operates emergency shelters and distributes warm clothing to those experiencing homelessness. Our mission is to ensure no one faces the cold alone. We provide emergency shelter during extreme weather, distribute warm clothing and blankets, and offer support services to help individuals transition to permanent housing.',
      category: 'Social Services',
      website: 'https://warmthforall.org',
      location: 'North America',
      totalReceived: 76200,
      beneficiaries: 12000,
      projectsCompleted: 85,
      image: 'https://images.pexels.com/photos/6995247/pexels-photo-6995247.jpeg?auto=compress&cs=tinysrgb&w=800',
      founded: 2010,
      isActive: true,
      mission: 'To ensure no one faces the cold alone by providing emergency shelter, warm clothing, and support services.',
      vision: 'A world where everyone has access to safe shelter and warmth, especially during harsh weather conditions.',
      contact: {
        email: 'info@warmthforall.org',
        phone: '+1 (555) 234-5678',
        address: '789 Shelter Street, Warm City, WC 23456'
      },
      programs: [
        {
          name: 'Emergency Shelter Program',
          description: 'Operating emergency shelters during extreme weather conditions.',
          impact: '85 shelters opened, 12,000 people sheltered'
        },
        {
          name: 'Warm Clothing Distribution',
          description: 'Distributing warm clothing, blankets, and winter gear to those in need.',
          impact: '50,000 items distributed, 8,000 people helped'
        },
        {
          name: 'Housing Transition Support',
          description: 'Helping individuals transition from emergency shelter to permanent housing.',
          impact: '200 people transitioned, 150 families stabilized'
        }
      ],
      recentUpdates: [
        {
          date: '2025-01-12',
          title: 'Winter Shelter Season Opens',
          content: 'We have opened 15 emergency shelters across the region to help those in need during the harsh winter months.'
        },
        {
          date: '2025-01-05',
          title: 'Warm Clothing Drive Success',
          content: 'Our annual warm clothing drive collected over 10,000 items, which are now being distributed to those in need.'
        }
      ],
      gallery: [
        'https://images.pexels.com/photos/6995247/pexels-photo-6995247.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/6995248/pexels-photo-6995248.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/6995249/pexels-photo-6995249.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/6995250/pexels-photo-6995250.jpeg?auto=compress&cs=tinysrgb&w=400'
      ]
    },
    '4': {
      id: '4',
      name: 'Arts Education',
      description: 'Supporting arts programs in schools and communities to foster creativity and cultural expression.',
      longDescription: 'Arts Education believes in the transformative power of creative expression. We fund arts programs in underserved schools and provide scholarships for talented young artists. Our programs include music, visual arts, theater, and dance, helping students develop creativity, confidence, and cultural awareness. We work with schools, community centers, and cultural institutions to make arts education accessible to all.',
      category: 'Education',
      website: 'https://artseducation.org',
      location: 'United States',
      totalReceived: 54300,
      beneficiaries: 6500,
      projectsCompleted: 35,
      image: 'https://images.pexels.com/photos/1153213/pexels-photo-1153213.jpeg?auto=compress&cs=tinysrgb&w=800',
      founded: 2018,
      isActive: true,
      mission: 'To make arts education accessible to all students, fostering creativity, confidence, and cultural expression.',
      vision: 'A world where every child has access to quality arts education, regardless of their background or economic status.',
      contact: {
        email: 'info@artseducation.org',
        phone: '+1 (555) 345-6789',
        address: '321 Creative Avenue, Arts City, AC 34567'
      },
      programs: [
        {
          name: 'School Arts Program',
          description: 'Funding arts programs in underserved schools, including music, visual arts, and theater.',
          impact: '35 schools funded, 6,500 students enrolled'
        },
        {
          name: 'Young Artist Scholarships',
          description: 'Providing scholarships for talented young artists to pursue advanced training.',
          impact: '200 scholarships awarded, 180 students continuing education'
        },
        {
          name: 'Community Arts Workshops',
          description: 'Organizing free arts workshops in community centers for all ages.',
          impact: '150 workshops held, 3,000 participants engaged'
        }
      ],
      recentUpdates: [
        {
          date: '2025-01-15',
          title: 'New School Partnership',
          content: 'We have partnered with 5 new schools to bring comprehensive arts programs to 1,200 additional students.'
        },
        {
          date: '2025-01-10',
          title: 'Scholarship Program Expansion',
          content: 'Our scholarship program has expanded to support 50 more talented young artists this year.'
        },
        {
          date: '2024-12-20',
          title: 'Holiday Arts Showcase',
          content: 'Over 200 students participated in our annual holiday arts showcase, displaying their creative talents to the community.'
        }
      ],
      gallery: [
        'https://images.pexels.com/photos/1153213/pexels-photo-1153213.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/1205651/pexels-photo-1205651.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/159844/cellular-education-classroom-159844.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/1720186/pexels-photo-1720186.jpeg?auto=compress&cs=tinysrgb&w=400'
      ]
    },
    '5': {
      id: '5',
      name: 'Tech for Kids',
      description: 'Bringing technology education to underserved youth and bridging the digital divide.',
      longDescription: 'Tech for Kids provides computer labs, coding classes, and digital literacy programs to children in low-income communities, preparing them for the digital future. We work to bridge the digital divide by providing access to technology, training, and mentorship opportunities.',
      category: 'Education',
      website: 'https://techforkids.org',
      location: 'Global',
      totalReceived: 43200,
      beneficiaries: 9200,
      projectsCompleted: 28,
      image: 'https://images.pexels.com/photos/5905709/pexels-photo-5905709.jpeg?auto=compress&cs=tinysrgb&w=800',
      founded: 2019,
      isActive: true,
      mission: 'To bridge the digital divide by providing technology education and access to underserved youth.',
      vision: 'A world where every child has the digital skills and access needed to thrive in the 21st century.',
      contact: {
        email: 'info@techforkids.org',
        phone: '+1 (555) 456-7890',
        address: '456 Tech Street, Digital City, DC 45678'
      },
      programs: [
        {
          name: 'Computer Lab Initiative',
          description: 'Setting up computer labs in schools and community centers.',
          impact: '28 labs established, 9,200 students served'
        },
        {
          name: 'Coding Bootcamps',
          description: 'Intensive coding programs for middle and high school students.',
          impact: '500 students trained, 200 pursuing tech careers'
        },
        {
          name: 'Digital Literacy Program',
          description: 'Teaching basic computer and internet skills to children and families.',
          impact: '3,000 families trained, 1,500 devices distributed'
        }
      ],
      recentUpdates: [
        {
          date: '2025-01-14',
          title: 'New Coding Bootcamp Launched',
          content: 'We launched a new coding bootcamp in partnership with local tech companies, training 50 students in web development.'
        }
      ],
      gallery: [
        'https://images.pexels.com/photos/5905709/pexels-photo-5905709.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/5905710/pexels-photo-5905710.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/5905711/pexels-photo-5905711.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/5905712/pexels-photo-5905712.jpeg?auto=compress&cs=tinysrgb&w=400'
      ]
    },
    '6': {
      id: '6',
      name: 'Ocean Conservation',
      description: 'Protecting marine ecosystems and promoting sustainable fishing practices worldwide.',
      longDescription: 'Ocean Conservation works to preserve our oceans through research, education, and direct action. We partner with local communities to implement sustainable practices and protect marine biodiversity.',
      category: 'Environment',
      website: 'https://oceanconservation.org',
      location: 'Global',
      totalReceived: 67800,
      beneficiaries: 25000,
      projectsCompleted: 52,
      image: 'https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg?auto=compress&cs=tinysrgb&w=800',
      founded: 2012,
      isActive: true,
      mission: 'To protect and preserve marine ecosystems through research, education, and sustainable practices.',
      vision: 'Healthy oceans that support thriving marine life and sustainable communities worldwide.',
      contact: {
        email: 'info@oceanconservation.org',
        phone: '+1 (555) 567-8901',
        address: '789 Ocean Drive, Coastal City, CC 56789'
      },
      programs: [
        {
          name: 'Marine Protected Areas',
          description: 'Establishing and managing protected marine areas to preserve biodiversity.',
          impact: '52 protected areas established, 25,000 marine species protected'
        },
        {
          name: 'Sustainable Fishing Initiative',
          description: 'Promoting sustainable fishing practices with local fishing communities.',
          impact: '30 communities engaged, 5,000 fishermen trained'
        },
        {
          name: 'Ocean Cleanup Program',
          description: 'Organizing beach cleanups and ocean plastic removal efforts.',
          impact: '200 cleanups organized, 50 tons of plastic removed'
        }
      ],
      recentUpdates: [
        {
          date: '2025-01-13',
          title: 'New Marine Sanctuary Established',
          content: 'We successfully established a new marine sanctuary protecting 500 square miles of critical ocean habitat.'
        }
      ],
      gallery: [
        'https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/1001683/pexels-photo-1001683.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/1001684/pexels-photo-1001684.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/1001685/pexels-photo-1001685.jpeg?auto=compress&cs=tinysrgb&w=400'
      ]
    },
    '7': {
      id: '7',
      name: 'Animal Rescue Network',
      description: 'Rescuing and rehabilitating abandoned and abused animals, finding them loving homes.',
      longDescription: 'Animal Rescue Network operates shelters and rescue programs across multiple states, providing medical care, rehabilitation, and adoption services for animals in need.',
      category: 'Animal Welfare',
      website: 'https://animalrescuenetwork.org',
      location: 'United States',
      totalReceived: 38900,
      beneficiaries: 5500,
      projectsCompleted: 95,
      image: 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=800',
      founded: 2014,
      isActive: true,
      mission: 'To rescue, rehabilitate, and rehome abandoned and abused animals.',
      vision: 'A world where every animal has a safe, loving home.',
      contact: {
        email: 'info@animalrescuenetwork.org',
        phone: '+1 (555) 678-9012',
        address: '123 Rescue Road, Pet City, PC 67890'
      },
      programs: [
        {
          name: 'Animal Rescue Operations',
          description: 'Rescuing animals from abuse, neglect, and dangerous situations.',
          impact: '95 rescue operations, 5,500 animals saved'
        },
        {
          name: 'Medical Care Program',
          description: 'Providing veterinary care and rehabilitation for rescued animals.',
          impact: '3,000 animals treated, 2,500 fully rehabilitated'
        },
        {
          name: 'Adoption Services',
          description: 'Finding loving homes for rescued animals through adoption programs.',
          impact: '4,000 animals adopted, 98% success rate'
        }
      ],
      recentUpdates: [
        {
          date: '2025-01-11',
          title: 'Record-Breaking Adoption Month',
          content: 'We had our best month ever with 200 animals finding their forever homes in December.'
        }
      ],
      gallery: [
        'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/1108100/pexels-photo-1108100.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/1108101/pexels-photo-1108101.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/1108102/pexels-photo-1108102.jpeg?auto=compress&cs=tinysrgb&w=400'
      ]
    },
    '8': {
      id: '8',
      name: 'Clean Water Initiative',
      description: 'Providing access to clean, safe drinking water in developing communities around the world.',
      longDescription: 'Clean Water Initiative builds wells, water treatment facilities, and sanitation systems in communities lacking access to clean water, improving health and quality of life.',
      category: 'Health',
      website: 'https://cleanwaterinitiative.org',
      location: 'Africa & Asia',
      totalReceived: 89400,
      beneficiaries: 18500,
      projectsCompleted: 67,
      image: 'https://images.pexels.com/photos/1739855/pexels-photo-1739855.jpeg?auto=compress&cs=tinysrgb&w=800',
      founded: 2011,
      isActive: true,
      mission: 'To provide access to clean, safe drinking water for communities in need worldwide.',
      vision: 'A world where everyone has access to clean water and proper sanitation.',
      contact: {
        email: 'info@cleanwaterinitiative.org',
        phone: '+1 (555) 789-0123',
        address: '456 Water Way, Fresh City, FC 78901'
      },
      programs: [
        {
          name: 'Well Construction',
          description: 'Building wells and water access points in rural communities.',
          impact: '67 wells built, 18,500 people served'
        },
        {
          name: 'Water Treatment Facilities',
          description: 'Installing water purification systems in communities.',
          impact: '25 facilities installed, 10,000 people with clean water'
        },
        {
          name: 'Sanitation Programs',
          description: 'Building latrines and promoting hygiene education.',
          impact: '500 latrines built, 5,000 families trained'
        }
      ],
      recentUpdates: [
        {
          date: '2025-01-09',
          title: 'New Well Project Completed',
          content: 'We completed construction of 5 new wells in rural Africa, providing clean water to 1,500 people.'
        }
      ],
      gallery: [
        'https://images.pexels.com/photos/1739855/pexels-photo-1739855.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/1739856/pexels-photo-1739856.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/1739857/pexels-photo-1739857.jpeg?auto=compress&cs=tinysrgb&w=400',
        'https://images.pexels.com/photos/1739858/pexels-photo-1739858.jpeg?auto=compress&cs=tinysrgb&w=400'
      ]
    }
  };

  const charity = charityData[id || '1'] || charityData['1'];
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <div className="dark:bg-slate-900 transition-colors min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-8 relative z-10">
        {/* Back Button */}
        <Link
          to="/charities"
          className="inline-flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 mb-6 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Charities
        </Link>

        {/* Hero Section */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200/60 dark:border-slate-700/60 overflow-hidden mb-6 transition-colors">
          <div className="aspect-video md:aspect-[3/1] overflow-hidden relative bg-slate-100 dark:bg-slate-700">
            {!imageLoaded && !imageError && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
              </div>
            )}

            {imageError ? (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-200 dark:bg-slate-600">
                <div className="text-center text-slate-400">
                  <Heart className="w-16 h-16 mx-auto mb-2 opacity-50 text-indigo-400" />
                  <div className="text-sm font-medium">Image unavailable</div>
                </div>
              </div>
            ) : (
              <img
                src={charity.image}
                alt={charity.name}
                className={`w-full h-full object-cover transition-all duration-700 ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageError(true)}
                loading="eager"
              />
            )}
          </div>
          
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-5">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-4">
                  <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white leading-tight">{charity.name}</h1>
                  <span className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-3 py-1 rounded-full text-sm font-semibold border border-indigo-200 dark:border-indigo-700">
                    {charity.category}
                  </span>
                </div>
                
                <p className="text-base md:text-lg text-slate-600 dark:text-slate-400 mb-5 leading-relaxed">{charity.description}</p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4">
                    <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">{formatPrice(charity.totalReceived)}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">Total Received</div>
                  </div>
                  <div className="text-center bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4">
                    <div className="text-xl font-bold text-indigo-600 dark:text-indigo-400">{charity.beneficiaries.toLocaleString()}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">Beneficiaries</div>
                  </div>
                  <div className="text-center bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4">
                    <div className="text-xl font-bold text-amber-600 dark:text-amber-400">{charity.projectsCompleted}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">Projects</div>
                  </div>
                  <div className="text-center bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4">
                    <div className="text-xl font-bold text-slate-700 dark:text-slate-300">{charity.founded}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">Founded</div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 md:mt-0 md:ml-6">
                <a
                  href={charity.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-800 text-white px-6 py-3 rounded-2xl font-bold text-sm hover:shadow-2xl hover:shadow-indigo-500/40 transition-all duration-500 transform hover:scale-105 hover:-translate-y-1 inline-flex items-center overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-indigo-600 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <span className="relative z-10">Visit Website</span>
                  <ExternalLink className="w-4 h-4 ml-2 relative z-10 group-hover:translate-x-1 transition-transform" />
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* About Section */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200/60 dark:border-slate-700/60 p-6 transition-colors">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4">About {charity.name}</h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-5 text-base">{charity.longDescription}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-5">
                  <div className="flex items-center mb-3">
                    <Target className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mr-2" />
                    <h3 className="font-semibold text-slate-900 dark:text-white">Our Mission</h3>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{charity.mission}</p>
                </div>
                
                <div className="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-5">
                  <div className="flex items-center mb-3">
                    <Globe className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mr-2" />
                    <h3 className="font-semibold text-slate-900 dark:text-white">Our Vision</h3>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{charity.vision}</p>
                </div>
              </div>
            </div>

            {/* Programs Section */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200/60 dark:border-slate-700/60 p-6 transition-colors">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-5">Our Programs</h2>
              <div className="space-y-5">
                {charity.programs.map((program: any, index: number) => (
                  <div key={index} className="border-l-4 border-indigo-500 dark:border-indigo-400 pl-5 bg-slate-50 dark:bg-slate-700/30 rounded-r-xl p-4">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">{program.name}</h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-3 text-sm leading-relaxed">{program.description}</p>
                    <div className="flex items-center text-sm text-emerald-600 dark:text-emerald-400">
                      <Award className="w-4 h-4 mr-1.5" />
                      <span className="font-medium">Impact: {program.impact}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Updates */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200/60 dark:border-slate-700/60 p-6 transition-colors">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-5">Recent Updates</h2>
              <div className="space-y-5">
                {charity.recentUpdates.map((update: any, index: number) => (
                  <div key={index} className="flex space-x-4 p-4 bg-slate-50 dark:bg-slate-700/30 rounded-xl">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/50 rounded-full flex items-center justify-center border border-indigo-200 dark:border-indigo-700">
                        <Calendar className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-slate-900 dark:text-white text-base">{update.title}</h3>
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{update.date}</span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{update.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Photo Gallery */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200/60 dark:border-slate-700/60 p-6 transition-colors">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-5">Photo Gallery</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {charity.gallery.map((image: string, index: number) => (
                  <div key={index} className="aspect-square overflow-hidden rounded-xl group cursor-pointer">
                    <img
                      src={image}
                      alt={`${charity.name} gallery ${index + 1}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-5">
            {/* Quick Info */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200/60 dark:border-slate-700/60 p-5 transition-colors">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Quick Info</h3>
              <div className="space-y-3">
                <div className="flex items-center text-sm">
                  <MapPin className="w-4 h-4 text-slate-400 mr-3" />
                  <span className="text-slate-600 dark:text-slate-400">{charity.location}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Calendar className="w-4 h-4 text-slate-400 mr-3" />
                  <span className="text-slate-600 dark:text-slate-400">Founded in {charity.founded}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Users className="w-4 h-4 text-slate-400 mr-3" />
                  <span className="text-slate-600 dark:text-slate-400">{charity.beneficiaries.toLocaleString()} beneficiaries</span>
                </div>
                <div className="flex items-center text-sm">
                  <TrendingUp className="w-4 h-4 text-slate-400 mr-3" />
                  <span className="text-slate-600 dark:text-slate-400">{charity.projectsCompleted} projects completed</span>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200/60 dark:border-slate-700/60 p-5 transition-colors">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Contact Information</h3>
              <div className="space-y-3">
                <div className="flex items-center text-sm">
                  <Mail className="w-4 h-4 text-slate-400 mr-3" />
                  <a href={`mailto:${charity.contact.email}`} className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors break-all">
                    {charity.contact.email}
                  </a>
                </div>
                <div className="flex items-center text-sm">
                  <Phone className="w-4 h-4 text-slate-400 mr-3" />
                  <a href={`tel:${charity.contact.phone}`} className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors">
                    {charity.contact.phone}
                  </a>
                </div>
                <div className="flex items-start text-sm">
                  <MapPin className="w-4 h-4 text-slate-400 mr-3 mt-0.5" />
                  <span className="text-slate-600 dark:text-slate-400 leading-relaxed">{charity.contact.address}</span>
                </div>
              </div>
            </div>

            {/* Support This Charity */}
            <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 rounded-2xl p-6 text-white relative overflow-hidden">
              <div className="absolute inset-0">
                <div className="absolute top-0 left-1/4 w-48 h-48 bg-indigo-500/10 rounded-full blur-2xl animate-pulse"></div>
                <div className="absolute bottom-0 right-1/4 w-40 h-40 bg-emerald-500/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
              </div>
              <div className="relative z-10">
                <div className="flex items-center mb-4">
                  <Heart className="w-6 h-6 mr-2 text-emerald-400" />
                  <h3 className="text-lg font-semibold">Support This Charity</h3>
                </div>
                <p className="text-slate-300 mb-5 text-sm leading-relaxed">
                  Shop on Trade2Help and choose {charity.name} to receive a percentage of your purchase.
                </p>
                <Link
                  to="/search"
                  className="group relative bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-800 text-white px-6 py-3 rounded-2xl font-bold text-sm hover:shadow-2xl hover:shadow-indigo-500/40 transition-all duration-500 transform hover:scale-105 hover:-translate-y-1 inline-flex items-center justify-center w-full overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-indigo-600 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <span className="relative z-10">Start Shopping</span>
                  <ArrowRight className="w-4 h-4 ml-2 relative z-10 group-hover:translate-x-1 transition-transform" />
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharityDetails;