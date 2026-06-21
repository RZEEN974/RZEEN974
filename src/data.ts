import { MenuItem, Review } from './types';

export const MENU_ITEMS: MenuItem[] = [
  // --- PIZZAS ---
  {
    id: 'margherita',
    name: {
      en: 'Margherita Pizza',
      ar: 'مارغريتــا'
    },
    description: {
      en: 'San Marzano tomato sauce, our custom master cheese blend, shaved parmesan, extra virgin olive oil, and fresh basil.',
      ar: 'صلصة طماطم سان مارزانو، طبقة من خليط الجبن المميز لدينا، جبنة بارميزان ورشة زيت زيتون بكر ممتاز وريحان طازج.'
    },
    priceSlice: 23,
    priceWhole: 139,
    image: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=800&auto=format&fit=crop&q=80',
    category: 'pizza',
    tags: ['Classic', 'Vegetarian'],
    options: [
      { en: 'Extra Cheese', ar: 'جبنة إضافية', price: 10 },
      { en: 'Spicy Ranch Drizzle', ar: 'رشة رانش حار', price: 4 }
    ]
  },
  {
    id: 'serroni-royal',
    name: {
      en: 'Serroni Royal (Premium Pepperoni)',
      ar: 'سيروني رويال (بيبيروني فاخر)'
    },
    description: {
      en: 'San Marzano tomato sauce, custom cheese blend, premium Serroni beef pepperoni, shaved parmesan, extra virgin olive oil, with an optional free hot honey drizzle.',
      ar: 'صلصة طماطم سان مارزانو، طبقة من خليط الجبن المميز لدينا، سيروني بيبيروني بقري، جبنة بارميزان، مع رشة زيت زيتون بكر ممتاز وعسل حار مجاني اختياري.'
    },
    priceSlice: 25,
    priceWhole: 159,
    image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=800&auto=format&fit=crop&q=80',
    category: 'pizza',
    tags: ['Best Seller', 'Spicy Opt'],
    options: [
      { en: 'Free Hot Honey Drizzle', ar: 'عسل حار مجاني', price: 0, default: true },
      { en: 'Sliced Jalapenos', ar: 'قطع هالبينو', price: 3 },
      { en: 'Extra Pepperoni', ar: 'بيبيروني إضافي', price: 12 }
    ]
  },
  {
    id: 'midnight-truffle',
    name: {
      en: 'Midnight Truffle',
      ar: 'ميدنايت ترفل (الفطر البري)'
    },
    description: {
      en: 'Signature white cream base, secret custom cheese blend, pan-roasted wild mushrooms, finished with premium truffle aioli drizzle.',
      ar: 'صلصة كريمي أبيض مميزة، طبقة من خليط الجبن المميز لدينا، فطر بري محمص، مع رشة من صلصة ترفل أيولي الفاخرة.'
    },
    priceSlice: 28,
    priceWhole: 169,
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&auto=format&fit=crop&q=80',
    category: 'pizza',
    tags: ['Gourmet', 'Chef Special'],
    options: [
      { en: 'Extra Wild Mushrooms', ar: 'فطر بري إضافي', price: 8 },
      { en: 'Double Truffle Drizzle', ar: 'رشة ترفل مضاعفة', price: 6 }
    ]
  },
  {
    id: 'the-hot-chick',
    name: {
      en: 'The Hot Chick',
      ar: 'ذا هوت تشيك (دجاج بوفالو)'
    },
    description: {
      en: 'San Marzano tomato sauce, our proprietary cheese blend, tender buffalo pulled chicken, topped with a cool ranch drizzle and chives.',
      ar: 'صلصة طماطم سان مارزانو، طبقة من خليط الجبن المميز لدينا، دجاج مسحب بصلصة البوفالو الحارة، مغطاة برشة صوص رانش غني وكزبرة.'
    },
    priceSlice: 28,
    priceWhole: 169,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=80',
    category: 'pizza',
    tags: ['Spicy', 'Popular'],
    options: [
      { en: 'Extra Buffalo Chicken', ar: 'دجاج بوفالو إضافي', price: 15 },
      { en: 'Extra Jalapeno Slices', ar: 'قطع هالبينو إضافية', price: 3 }
    ]
  },
  {
    id: 'signature-brisket-melt',
    name: {
      en: 'Signature Brisket Melt',
      ar: 'بريسكيت ملت المميز'
    },
    description: {
      en: 'San Marzano tomato sauce, signature cheese blend, 12-hour slow smoked tender brisket, drizzled with sweet smokey BBQ glaze and crispy onions.',
      ar: 'صلصة طماطم سان مارزانو، طبقة من خليط الجبن المميز لدينا، بريسكيت بقري مدخن على مدى ١٢ ساعة، مغطى بصلصة باربيكيو حلوة وبصل مقرمش.'
    },
    priceSlice: 29,
    priceWhole: 179,
    image: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=800&auto=format&fit=crop&q=80',
    category: 'pizza',
    tags: ['12h Smoked', 'Premium'],
    options: [
      { en: 'Extra Smoked Brisket', ar: 'لحم بريسكيت إضافي', price: 20 },
      { en: 'Caramelized Onions', ar: 'بصل مكرمل', price: 5 }
    ]
  },
  {
    id: 'smash-burger-pizza',
    name: {
      en: 'Signature Smash Burger Pizza',
      ar: 'سيفنيتشر سماش بيرجر بيتزا'
    },
    description: {
      en: 'Zesty house sriracha burger sauce, proprietary four-cheese blend, crispy smash burger beef patties, pickles, and sweet smokey BBQ drizzle.',
      ar: 'صلصة سيراتشا برجر الحارة والمميزة، طبقة من جبنتنا الخاصة، قطع لحم السماش برجر المفروم المقرمشة، مخلل، وصلصة باربيكيو غنية.'
    },
    priceSlice: 29,
    priceWhole: 179,
    image: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=800&auto=format&fit=crop&q=80',
    category: 'pizza',
    tags: ['Heavyweight', 'Unique'],
    options: [
      { en: 'Extra Beef Patty', ar: 'شريحة لحم إضافية', price: 15 },
      { en: 'Siriacha Drizzle', ar: 'رشة سيراتشا', price: 3 }
    ]
  },
  {
    id: 'the-red-burrata',
    name: {
      en: 'The Red Burrata',
      ar: 'ذا ريد بوراتــا'
    },
    description: {
      en: 'Rich San Marzano tomato base, signature cheese mozzarella blend, crowned with high grade fresh creamy burrata, olive oil, and hot honey choice.',
      ar: 'صلصة طماطم سان مارزانو الغنية، طبقة من خليط الجبن المميز، مغطاة بكرة جبنة البوراتا الطازجة والكريمية، زيت زيتون بكر وعسل حار اختياري.'
    },
    priceSlice: 28,
    priceWhole: 169,
    image: 'https://images.unsplash.com/photo-1594007654729-407ededc414a?w=800&auto=format&fit=crop&q=80',
    category: 'pizza',
    tags: ['Creamy', 'Favored'],
    options: [
      { en: 'Free Hot Honey Drizzle', ar: 'عسل حار مجاني', price: 0, default: true },
      { en: 'Fresh Basil Pesto', ar: 'بيستو ريحان طازج', price: 5 },
      { en: 'Cherry Tomatoes', ar: 'طماطم كرزية', price: 4 }
    ]
  },
  {
    id: 'italian-dream',
    name: {
      en: 'Italian Dream',
      ar: 'إيطاليان دريـم (حلم إيطاليا)'
    },
    description: {
      en: 'Special white cream base, double cheese blend, fresh local burrata cheese, roasted vine cherry tomatoes, with optional wild basil pesto drizzle.',
      ar: 'صلصة كريمة بيضاء مميزة، طبقة من خليط الجبن الفاخر، جبنة بوراتا طازجة، طماطم كرزية شيري مشوية، مع رشة صوص بيستو الريحان العطري.'
    },
    priceSlice: 28,
    priceWhole: 169,
    image: 'https://images.unsplash.com/photo-1555072956-7758afb20e8f?w=800&auto=format&fit=crop&q=80',
    category: 'pizza',
    tags: ['Herbaceous', 'Vegetarian'],
    options: [
      { en: 'Extra Pesto Sauce', ar: 'صلصة بيستو إضافية', price: 4 },
      { en: 'Roasted Garlic Clues', ar: 'ثوم مشوي', price: 3 }
    ]
  },
  {
    id: 'caesar-royal',
    name: {
      en: 'Caesar Royal Pizza',
      ar: 'سيزر رويال بيتزا'
    },
    description: {
      en: 'Artisanal white crust base, mozzarella premium, tender grilled breast chicken, crisp shredded Romaine lettuce, shaved parmesan cheese and Caesar dress.',
      ar: 'صلصة كريمي أبيض فاخرة، طبقة الجبن الكرسبي المميزة، دجاج فيليه مشوي، خس روماني مقرمش، شرائح جبنة البارميزان مغطاة بصلصة السيزر.'
    },
    priceSlice: 28,
    priceWhole: 169,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=80',
    category: 'pizza',
    tags: ['Fresh Crunch'],
    options: [
      { en: 'Extra Grilled Chicken', ar: 'دجاج مشوي إضافي', price: 12 },
      { en: 'Extra Caesar Drizzle', ar: 'صلصة سيزر إضافية', price: 3 }
    ]
  },

  // --- SIDES ---
  {
    id: 'crispy-fries-sriracha',
    name: {
      en: 'Sriracha Crispy Chicken Fries',
      ar: 'فرانش فرايز بالدجاج المقرمش'
    },
    description: {
      en: 'Crispy premium golden french fries topped with crunchy chicken tenders, and drizzled with our signature sriracha ranch sauce.',
      ar: 'بطاطس مقلية مميزة، مقرمشة وذهبية، مغطاة بقطع الدجاج المقرمش اللذيذة وصلصة السيراتشا رانش الخاصة بنا.'
    },
    priceStandard: 20,
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=800&auto=format&fit=crop&q=80',
    category: 'sides',
    tags: ['Spicy', 'Popular Choice']
  },
  {
    id: 'classic-crispy-fries',
    name: {
      en: 'Crispy Shaked Fries',
      ar: 'فرانش فرايز مقرمشة'
    },
    description: {
      en: 'Premium skin-on thick golden french fries, perfectly crispy on the outside, fluffy inside, with sea salt and parmesan dust.',
      ar: 'بطاطس مقلية مميزة، مقرمشة، ذهبية ولا تقاوم، متبلة بملح البحر والقليل من جبن البارميزان.'
    },
    priceStandard: 15,
    image: 'https://images.unsplash.com/photo-1576107232684-1279f390859f?w=800&auto=format&fit=crop&q=80',
    category: 'sides'
  },
  {
    id: 'mozzarella-sticks',
    name: {
      en: 'Gooey Mozzarella Sticks',
      ar: 'أصابع الجبنة الموزاريلا'
    },
    description: {
      en: 'Crispy batter outside, high-pull melting mozzarella cheese inside. Served with warm marinara sauce dip.',
      ar: 'أصابع موزاريلا مقلية ذهبية ومقرمشة ومحشوة بالجبن الغني، تقدم مع صلصة المارينارا الدافئة.'
    },
    priceStandard: 17,
    image: 'https://images.unsplash.com/photo-1531749668029-2db88e4b76c7?w=800&auto=format&fit=crop&q=80',
    category: 'sides'
  },
  {
    id: 'classic-caesar-salad',
    name: {
      en: 'Classic Caesar Salad',
      ar: 'سلطة سيزر كلاسيكية'
    },
    description: {
      en: 'Crispy Romaine lettuce gems tossed with grilled chicken cubes, tossed with caesar house dressing, golden croutons, and grated parmesan.',
      ar: 'خس مقرمش مع مكعبات صدر الدجاج المشوية، مغطى بصلصة سيزر، كروتون محمص وجبنة بارميزان وفيرة.'
    },
    priceStandard: 25,
    image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=800&auto=format&fit=crop&q=80',
    category: 'sides',
    tags: ['Fresh', 'Healthy']
  },

  // --- DRINKS ---
  {
    id: 'mojito-strawberry',
    name: {
      en: 'Strawberry Mojito',
      ar: 'موهيتو فراولة منعش'
    },
    description: {
      en: 'A refreshing effervescent blend of fresh local strawberries, mint leaves, fresh lime wedges, sparkling soda, and ice.',
      ar: 'مزيج فوار ومنعش من قطع الفراولة الطازجة، أوراق النعناع، شرائح الليمون، صودا باردة وثلج.'
    },
    priceStandard: 26,
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=800&auto=format&fit=crop&q=80',
    category: 'drinks',
    tags: ['Most Loved', 'Cold Drink']
  },
  {
    id: 'mojito-passion',
    name: {
      en: 'Tropical Passion Fruit Mojito',
      ar: 'موهيتو فواكه الشغف (باشن فروت)'
    },
    description: {
      en: 'A sweet and sour revitalizing blend of tropical passion fruit, fresh mint, freshly squeezed lime, and chilled soda water.',
      ar: 'مزيج مبهج ومنشط من باشن فروت الاستوائية، النعناع الطازج، عصير الليمون، والصودا الفوارة.'
    },
    priceStandard: 26,
    image: 'https://images.unsplash.com/photo-1536935338788-846bb9981813?w=800&auto=format&fit=crop&q=80',
    category: 'drinks'
  },
  {
    id: 'mojito-mixed-berry',
    name: {
      en: 'Mixed Berry Forest Mojito',
      ar: 'موهيتو مكس توت بري'
    },
    description: {
      en: 'A vibrant selection of forest blueberries, raspberries, and blackberries, muddled with juicy lime, mint, and fizzy soda.',
      ar: 'مزيج غني من الفواكه البرية مثل التوت الأزرق والأحمر والأسود، مع الليمون والنعناع والصودا المنعشة.'
    },
    priceStandard: 26,
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=800&auto=format&fit=crop&q=80',
    category: 'drinks',
    tags: ['Premium']
  },
  {
    id: 'mojito-lemon',
    name: {
      en: 'Lemon Mint Minty Mojito',
      ar: 'موهيتو الليمون الكلاسيكي'
    },
    description: {
      en: 'The absolute zesty classic - freshly crushed premium limes, refreshing mint sprigs, pure sugar cane syrup, and fizzy soda.',
      ar: 'المنعش الكلاسيكي الفاخر: ليمون معصور، أوراق نعناع حية، صودا فوارة وثلج مجروش.'
    },
    priceStandard: 26,
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=800&auto=format&fit=crop&q=80',
    category: 'drinks'
  },
  {
    id: 'red-lemonade',
    name: {
      en: 'Red Passion Lemonade',
      ar: 'ليمونادة حمراء منعشة'
    },
    description: {
      en: 'House brewed ruby sweet-tart lemonade infused with delicious red berries juice.',
      ar: 'ليمونادة فاكهية حلوة وحامضة محضرة محلياً بلون ياقوتي وممزوجة بعصير التوت البري اللذيذ.'
    },
    priceStandard: 25,
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=800&auto=format&fit=crop&q=80',
    category: 'drinks'
  },
  {
    id: 'fresh-orange-juice',
    name: {
      en: 'Pure Fresh Orange Juice',
      ar: 'عصير برتقال طبيعي طازج'
    },
    description: {
      en: '100% natural, freshly squeezed sweet citrus sun-ripened oranges, served ice cold with no added sugar.',
      ar: 'عصير برتقال طبيعي معصور طازجاً بنسبة ١٠٠٪، يقدم بارداً غنياً بفتامين سي وبدون إضافة سكر.'
    },
    priceStandard: 20,
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=800&auto=format&fit=crop&q=80',
    category: 'drinks'
  },
  {
    id: 'sparkling-water-voss',
    name: {
      en: 'Voss Premium Sparkling Water',
      ar: 'ماء غازي فوس بارد'
    },
    description: {
      en: 'Premium Voss imported sparkling water (served elegantly cold in their iconic luxury bottle).',
      ar: 'مياه فوس الغازية الفاخرة والمستوردة، تقدم باردة ومنعشة في زجاجتها الأيقونية المميزة.'
    },
    priceStandard: 12,
    image: 'https://images.unsplash.com/photo-1608885898957-a599fb1b4674?w=800&auto=format&fit=crop&q=80',
    category: 'drinks'
  },
  {
    id: 'still-water-voss',
    name: {
      en: 'Voss Pure Still Water',
      ar: 'مياه فوس طبيعية نقية'
    },
    description: {
      en: 'Premium Voss artesian pure still water to accompany your premium pizza adventure.',
      ar: 'مياه ارتوازية نقية جداً من مياه فوس، الرفيق الأمثل لرحلة المذاق الفاخر.'
    },
    priceStandard: 10,
    image: 'https://images.unsplash.com/photo-1608885898957-a599fb1b4674?w=800&auto=format&fit=crop&q=80',
    category: 'drinks'
  },
  {
    id: 'coda-cola',
    name: {
      en: 'Coca-Cola Can',
      ar: 'كوكاكولا'
    },
    description: {
      en: 'Classic fizzy refreshment.',
      ar: 'المشروب الغازي الكلاسيكي البارد.'
    },
    priceStandard: 5,
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=800&auto=format&fit=crop&q=80',
    category: 'drinks'
  },
  {
    id: 'coca-cola-zero',
    name: {
      en: 'Coca-Cola Zero Can',
      ar: 'كوكاكولا زيرو'
    },
    description: {
      en: 'Rich iconic taste with zero calories.',
      ar: 'الطعم الأصلي الخالي من السكر والسعرات الحرارية.'
    },
    priceStandard: 5,
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=800&auto=format&fit=crop&q=80',
    category: 'drinks'
  },
  {
    id: 'fanta-strawberry',
    name: {
      en: 'Fanta Strawberry Can',
      ar: 'فانتا فراولة'
    },
    description: {
      en: 'Juicy and sweet strawberry flavor.',
      ar: 'فانتا بنكهة الفراولة اللذيذة والحلوة.'
    },
    priceStandard: 5,
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=800&auto=format&fit=crop&q=80',
    category: 'drinks'
  },
  {
    id: 'fanta-orange',
    name: {
      en: 'Fanta Orange Can',
      ar: 'فانتا برتقال'
    },
    description: {
      en: 'Zesty sparkling orange soda.',
      ar: 'المنعش الفوار بنكهة البرتقال والفاكهة.'
    },
    priceStandard: 5,
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=800&auto=format&fit=crop&q=80',
    category: 'drinks'
  },
  {
    id: 'seven-up',
    name: {
      en: '7-Up Can',
      ar: 'سيفن اب'
    },
    description: {
      en: 'Fizzy lemon-lime refresher.',
      ar: 'مشروب الليمون واللايم المنعش والخالي من الكافيين.'
    },
    priceStandard: 5,
    image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=800&auto=format&fit=crop&q=80',
    category: 'drinks'
  },

  // --- DESSERTS ---
  {
    id: 'signature-tiramisu',
    name: {
      en: 'Signature Tiramisu',
      ar: 'سيفنيتشر تيراميسو فاخر'
    },
    description: {
      en: 'Decadent Italian classic with layers of espresso-soaked ladyfinger sponge, cloud-like creamy mascarpone custard, dusted premium cocoa powder.',
      ar: 'تيراميسو فاخر على حد تصنيفه الخاص، طبقات كيك أصابع السكر مغموسة بقهوة الإكسبريسو الغنية، كريمة الماسكاربوني المخملية ورشة كاكاو داكنة.'
    },
    priceStandard: 32,
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800&auto=format&fit=crop&q=80',
    category: 'desserts',
    tags: ['Must Try', 'Chef Pride']
  }
];

export const REVIEWS: Review[] = [
  {
    id: 'review-1',
    author: 'Abdulrahman Al-Thani',
    rating: 5,
    date: {
      en: '2 weeks ago',
      ar: 'قبل أسبوعين'
    },
    text: {
      en: 'Honestly, the best pizza experience of Qatar! The 12-hour Smoked Brisket Melt whole size is incredible. Real woodoven taste and premium toppings. The truffle aioli they pour on Midnight Truffle is top notch! Staff were super responsive via drive-through.',
      ar: 'بصراحة، أفضل تجربة بيتزا في قطر بالكامل! بيتزا البريسكيب المدخن ١٢ ساعة الحجم الكامل رهيبة جداً. وطعم الفرن الحقيقي والمكونات متميزة جداً. التراي آيولي على ميدنايت ترافل لا يعلى عليه! تعامل الطاقم راقي وسريعين جداً عبر خدمة السيارات.'
    },
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    googleReview: true
  },
  {
    id: 'review-2',
    author: 'Layla Al-Kuwari',
    rating: 5,
    date: {
      en: '1 month ago',
      ar: 'قبل شهر'
    },
    text: {
      en: 'We tried the Red Burrata and Serroni Royal slices. Slices are huge! "Sip by day, slice by night" is their logo line on paper and it really justifies it. Adding the free hot honey onto pepperoni was a sweet-spicy symphony. 4.9 rating is absolutely well deserved!',
      ar: 'جربنا شرائح البيتزا بوراتا الحمراء وسيروني رويال. حجم الشريحة ضخم ومشبع! شعارهم "رشفة بالنهار، شريحة بالليل" مطبوع على الأوراق ومعبر جداً. إضافة العسل الحار المجاني مع البيبيروني عاطي طعم روعة منسجم مابين الحار والحلو. تقييم ٤.٩ مستحق!'
    },
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
    googleReview: true
  },
  {
    id: 'review-3',
    author: 'Mark Henderson',
    rating: 5,
    date: {
      en: '3 weeks ago',
      ar: 'قبل ٣ أسابيع'
    },
    text: {
      en: 'Wow, dynamic and aesthetic brand! The Smash Burger Pizza is so unique with the sriracha burger sauce. Excellent crispy chicken french fries side. The tiramisu is the king of desserts around here. Extremely fresh ladyfingers.',
      ar: 'يا إلهي، هوية تجارية ممتازة ونابضة بالحياة! بيتزا سماش برجر رائعة ومبتكرة جداً مع صوص السيراتشا. والبطاطس المقرمشة بالدجاج رهيبة. التيراميسو هنا هو ملك الحلويات بلا منازع، قطع مبلولة بالإسبريسو وطازجة.'
    },
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    googleReview: true
  },
  {
    id: 'review-4',
    author: 'Fatima Al-Hamad',
    rating: 4,
    date: {
      en: '2 months ago',
      ar: 'قبل شهرين'
    },
    text: {
      en: 'Gorgeous ambiance, sitting inside is cute and intimate though limited in space. Highly recommend order via drive-through or Talabat. The Italian Dream with burrata and basil pesto is my absolute favorite, super light on the stomach.',
      ar: 'جلسات داخلية لطيفة وجميلة جداً بالرغم من صغر المساحة. خدمة السيارات سريعة جداً وخيار ممتاز وطلب تالابات مريح. بيتزا حلم إيطاليا مع جبن البوراتا مع صوص البيستو هي المفضلة لدي على الإطلاق، وخفيفة جداً على المعدة.'
    },
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80',
    googleReview: true
  }
];
