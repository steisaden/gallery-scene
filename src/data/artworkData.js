// src/data/artworkData.js

/**
 * Comprehensive artwork metadata for the gallery
 */
export const artworkData = [
    {
      id: "art1",
      title: "Cosmic Exploration",
      artist: "Alexandra Chen",
      description: "A vibrant abstract representation of space exploration, featuring nebulae and celestial bodies in rich blues and purples. This piece explores the relationship between human curiosity and the vast unknown of space, inviting viewers to contemplate their place in the universe.",
      year: "2023",
      medium: "Digital painting on canvas",
      dimensions: "24 × 36 inches",
      price: 1200,
      currency: "USD",
      forSale: true,
      limited: false,
      categories: ["cityscape", "realism"],
      tags: ["urban", "city", "reflection", "water", "dusk"],
      imageUrl: "/assets/imgs/img2.jpg",
      artistBio: "Marcus Williams is an urban landscape painter who captures the dynamic energy of city life. His work focuses on the interplay of natural and artificial light in urban environments, often painted during transitional times of day.",
      exhibitionHistory: ["Urban Perspectives 2022", "City Lights 2021"],
      reviews: [
        {
          author: "Metropolitan Arts Review",
          text: "Williams has an exceptional eye for how light transforms urban landscapes, particularly at dusk and dawn.",
          rating: 4.8
        }
      ]
    },
    {
      id: "art3",
      title: "Serenity in Motion",
      artist: "Sophia Lin",
      description: "Abstract representation of waves and flowing water, capturing the essence of tranquility within movement. Using a carefully curated palette of blues and whites, Lin creates a meditative piece that invites viewers to find calm in the midst of constant change.",
      year: "2023",
      medium: "Acrylic on canvas",
      dimensions: "36 × 24 inches",
      price: 950,
      currency: "USD",
      forSale: true,
      limited: false,
      categories: ["abstract", "nature"],
      tags: ["water", "blue", "flow", "peace"],
      imageUrl: "/assets/imgs/img3.jpg",
      artistBio: "Sophia Lin's work focuses on the fluidity of nature and emotion. With a background in both fine arts and environmental science, she creates pieces that bridge the gap between scientific observation and emotional experience.",
      exhibitionHistory: ["Elements in Flux 2023", "Water Works 2022"],
      reviews: [
        {
          author: "Nature & Art Quarterly",
          text: "Lin's ability to capture the paradoxical stillness within movement makes her work distinctively meditative.",
          rating: 4.3
        }
      ]
    },
    {
      id: "art4",
      title: "Fractured Memories",
      artist: "Julian Ross",
      description: "A fragmented portrait exploring themes of memory and identity, with overlapping geometric shapes creating a sense of disorientation and familiarity. The piece invites viewers to consider how memories shape our sense of self, and how those memories themselves are constantly being reshaped.",
      year: "2021",
      medium: "Mixed media on canvas",
      dimensions: "40 × 40 inches",
      price: 2200,
      currency: "USD",
      forSale: true,
      limited: true,
      edition: "3/5",
      categories: ["portrait", "abstract", "conceptual"],
      tags: ["memory", "identity", "fragmented", "geometric"],
      imageUrl: "/assets/imgs/img4.jpg",
      artistBio: "Julian Ross explores the intersection of psychology and art, focusing on how perception and memory shape human experience. His mixed media approach mimics the layered, complex nature of consciousness and recollection.",
      exhibitionHistory: ["Mind & Matter 2022", "Identity in Pieces 2020"],
      reviews: [
        {
          author: "Psychology in Art Review",
          text: "Ross's fragmented portraits serve as visual metaphors for the imperfect nature of memory and the constructed nature of identity.",
          rating: 4.7
        }
      ]
    },
    {
      id: "art5",
      title: "Primordial Garden",
      artist: "Elena Rodriguez",
      description: "A lush, tropical landscape inspired by ancient forests, featuring vibrant flora and subtle hints of wildlife. Rodriguez creates an immersive environment that transports viewers to a time before human intervention, celebrating the raw power and beauty of untouched nature.",
      year: "2022",
      medium: "Oil on canvas",
      dimensions: "48 × 36 inches",
      price: 3200,
      currency: "USD",
      forSale: true,
      limited: false,
      categories: ["landscape", "nature"],
      tags: ["forest", "tropical", "green", "primordial"],
      imageUrl: "/assets/imgs/img5.jpg",
      artistBio: "Elena Rodriguez draws inspiration from her extensive travels through rainforests and ancient woodlands. Her work celebrates biodiversity and advocates for environmental conservation through its detailed depictions of ecosystems.",
      exhibitionHistory: ["Wild Earth 2022", "Biophilia 2021", "Natural Wonders 2020"],
      reviews: [
        {
          author: "Environmental Arts Journal",
          text: "Rodriguez's paintings are not just beautiful; they serve as detailed documents of ecosystems increasingly under threat.",
          rating: 4.9
        }
      ]
    },
    {
      id: "art6",
      title: "Digital Decay",
      artist: "Akira Tanaka",
      description: "A commentary on technological obsolescence, featuring glitched imagery and digital artifacts rendered in photorealistic detail. This piece explores the transient nature of digital culture, where yesterday's cutting-edge technology quickly becomes today's nostalgic relic.",
      year: "2023",
      medium: "Digital art, printed on aluminum",
      dimensions: "24 × 36 inches",
      price: 1400,
      currency: "USD",
      forSale: true,
      limited: true,
      edition: "5/20",
      categories: ["digital", "conceptual", "technology"],
      tags: ["glitch", "digital", "decay", "technology"],
      imageUrl: "/assets/imgs/img6.jpg",
      artistBio: "Akira Tanaka works at the intersection of digital art and cultural criticism. With a background in computer science and fine arts, Tanaka creates works that question our relationship with technology and digital ephemera.",
      exhibitionHistory: ["Digital Archaeology 2023", "Bits & Pieces 2022"],
      reviews: [
        {
          author: "Digital Arts Now",
          text: "Tanaka's work forces us to confront the inherent impermanence of our digital lives and artifacts.",
          rating: 4.6
        }
      ]
    },
    {
      id: "art7",
      title: "Solitude by the Shore",
      artist: "Emily Carter",
      description: "A minimalist seascape exploring themes of solitude and contemplation, with a lone figure gazing at the horizon. The piece captures that universal moment of reflection that occurs when humans stand at the edge of vast natural spaces.",
      year: "2021",
      medium: "Watercolor on paper",
      dimensions: "18 × 24 inches",
      price: 850,
      currency: "USD",
      forSale: true,
      limited: false,
      categories: ["landscape", "minimalist", "seascape"],
      tags: ["ocean", "solitude", "contemplation", "horizon"],
      imageUrl: "/assets/imgs/img7.jpg",
      artistBio: "Emily Carter specializes in watercolor seascapes that capture the emotional resonance of coastal environments. Her work explores human connection to water and the psychological effects of open horizons.",
      exhibitionHistory: ["Coastal Contemplations 2021", "Horizons 2020"],
      reviews: [
        {
          author: "Watercolor Masters Quarterly",
          text: "Carter's control of the watercolor medium perfectly captures the ephemeral quality of light on water.",
          rating: 4.4
        }
      ]
    },
    {
      id: "art8",
      title: "Abstract Composition #28",
      artist: "Victor Krause",
      description: "A geometric abstract composition exploring color relationships and spatial tension through overlapping shapes and bold contrasts. Krause employs a sophisticated color theory approach to create visual rhythms that guide the viewer's eye through the composition.",
      year: "2022",
      medium: "Acrylic on canvas",
      dimensions: "36 × 36 inches",
      price: 1600,
      currency: "USD",
      forSale: true,
      limited: false,
      categories: ["abstract", "geometric", "contemporary"],
      tags: ["geometric", "composition", "color", "shapes"],
      imageUrl: "/assets/imgs/img8.jpg",
      artistBio: "Victor Krause's work is deeply influenced by the Bauhaus tradition and color field painting. His geometrically precise compositions explore the psychological effects of color relationships and spatial arrangement.",
      exhibitionHistory: ["Geometric Abstractions 2022", "Color Theory in Practice 2021"],
      reviews: [
        {
          author: "Modern Abstract Review",
          text: "Krause's work demonstrates that geometric abstraction remains a vital form of visual exploration in contemporary art.",
          rating: 4.2
        }
      ]
    },
    {
      id: "art9",
      title: "Heritage Whispers",
      artist: "Amara Okafor",
      description: "A mixed media piece combining traditional African patterns with contemporary portraiture, exploring themes of cultural identity and heritage. Okafor weaves together personal and collective histories to create a dialogue between past traditions and present realities.",
      year: "2023",
      medium: "Mixed media on wood panel",
      dimensions: "30 × 40 inches",
      price: 2800,
      currency: "USD",
      forSale: true,
      limited: true,
      edition: "Original",
      categories: ["portrait", "cultural", "mixed media"],
      tags: ["heritage", "africa", "identity", "patterns"],
      imageUrl: "/assets/imgs/img9.jpg",
      artistBio: "Amara Okafor explores the African diaspora experience through her mixed media works. Combining traditional patterns with contemporary portraiture, her art examines cultural identity, heritage, and the dialogue between ancestral wisdom and modern life.",
      exhibitionHistory: ["Diaspora Dialogues 2023", "Cultural Threads 2022", "Identity & Heritage 2021"],
      reviews: [
        {
          author: "Cultural Arts Magazine",
          text: "Okafor's integration of traditional patterns with contemporary portraiture creates a powerful visual representation of cultural continuity.",
          rating: 4.9
        }
      ]
    },
    {
      id: "art10",
      title: "Echoes of Industry",
      artist: "Thomas Miller",
      description: "An atmospheric painting of an abandoned industrial site, exploring themes of decay, history, and the relationship between nature and human-made structures. Miller's work documents the slow reclamation of industrial spaces by natural processes, finding beauty in decay.",
      year: "2021",
      medium: "Oil on canvas",
      dimensions: "48 × 36 inches",
      price: 2200,
      currency: "USD",
      forSale: true,
      limited: false,
      categories: ["industrial", "landscape", "urban"],
      tags: ["abandoned", "factory", "decay", "atmospheric"],
      imageUrl: "/assets/imgs/img10.jpg",
      artistBio: "Thomas Miller documents post-industrial landscapes across America. His atmospheric paintings explore the historical significance of manufacturing sites and their gradual return to nature, serving as meditations on economic change and environmental resilience.",
      exhibitionHistory: ["Post-Industrial America 2022", "Rust Belt Renaissance 2020"],
      reviews: [
        {
          author: "Industrial Heritage Review",
          text: "Miller's paintings serve as both historical documentation and poetic reflection on America's changing economic landscape.",
          rating: 4.5
        }
      ]
    },
    {
      id: "art11",
      title: "Quantum Dreams",
      artist: "Alexandra Chen",
      description: "A visualization of quantum physics concepts through abstract forms and fluorescent colors, bridging science and art. Chen uses advanced digital techniques to render invisible scientific phenomena visible, creating an aesthetic entry point into complex scientific concepts.",
      year: "2023",
      medium: "Digital art, LED-enhanced print",
      dimensions: "36 × 24 inches",
      price: 1800,
      currency: "USD",
      forSale: true,
      limited: true,
      edition: "2/8",
      categories: ["digital", "science", "abstract"],
      tags: ["quantum", "physics", "science", "fluorescent"],
      imageUrl: "/assets/imgs/img11.jpg",
      artistBio: "Alexandra Chen holds degrees in both quantum physics and digital arts. Her work visualizes scientific concepts that typically exist beyond human perception, creating bridges between scientific understanding and aesthetic experience.",
      exhibitionHistory: ["Science in Art 2023", "Quantum Aesthetics 2022"],
      reviews: [
        {
          author: "Science & Arts Quarterly",
          text: "Chen's work represents the best of sci-art collaboration, making complex scientific concepts accessible through visual poetry.",
          rating: 4.7
        }
      ]
    },
    {
      id: "art12",
      title: "Mountain Majesty",
      artist: "Daniel Hayes",
      description: "A dramatic mountain landscape inspired by the Canadian Rockies, capturing the sublime power and beauty of nature. Hayes uses dramatic lighting and precise detail to evoke the overwhelming emotional experience of standing before massive mountain formations.",
      year: "2022",
      medium: "Oil on canvas",
      dimensions: "36 × 48 inches",
      price: 2600,
      currency: "USD",
      forSale: true,
      limited: false,
      categories: ["landscape", "nature", "realism"],
      tags: ["mountains", "rockies", "nature", "dramatic"],
      imageUrl: "/assets/imgs/img12.jpg",
      artistBio: "Daniel Hayes specializes in large-scale landscape paintings that capture the sublime quality of wilderness. His work is influenced by both the Hudson River School tradition and contemporary environmental concerns.",
      exhibitionHistory: ["American Landscapes 2022", "Mountain Light 2021", "The Sublime Now 2020"],
      reviews: [
        {
          author: "Landscape Art Today",
          text: "Hayes continues the great tradition of landscape painting while bringing a contemporary environmental awareness to his majestic mountain scenes.",
          rating: 4.8
        }
      ]
    },
    {
      id: "art13",
      title: "Urban Rhythm",
      artist: "Marcus Williams",
      description: "A dynamic street scene capturing the movement and energy of city life through blurred figures and strong directional elements. Williams creates a sensory impression of urban energy through strategic use of motion blur and atmospheric perspective.",
      year: "2021",
      medium: "Acrylic on canvas",
      dimensions: "30 × 40 inches",
      price: 1700,
      currency: "USD",
      forSale: true,
      limited: false,
      categories: ["urban", "figurative", "contemporary"],
      tags: ["city", "movement", "street", "energy"],
      imageUrl: "/assets/imgs/img13.jpg",
      artistBio: "Marcus Williams draws inspiration from the kinetic energy of urban environments. His work captures the rhythm and flow of city life, focusing on how human movement creates patterns in metropolitan spaces.",
      exhibitionHistory: ["City Motion 2022", "Urban Currents 2021"],
      reviews: [
        {
          author: "Urban Arts Magazine",
          text: "Williams captures not just the visual but the kinetic and auditory experience of urban life in his dynamic compositions.",
          rating: 4.6
        }
      ]
    },
    {
      id: "art14",
      title: "Cybernetic Organism",
      artist: "Akira Tanaka",
      description: "A surrealist exploration of the merging of human and machine, featuring intricate biomechanical details and a futuristic aesthetic. This sculpture examines the increasingly blurred boundaries between biological and technological systems.",
      year: "2023",
      medium: "Digital sculpture, 3D printed in resin",
      dimensions: "12 × 8 × 8 inches",
      price: 2200,
      currency: "USD",
      forSale: true,
      limited: true,
      edition: "4/15",
      categories: ["sculpture", "digital", "sci-fi"],
      tags: ["cybernetic", "biomechanical", "future", "surreal"],
      imageUrl: "/assets/imgs/img14.jpg",
      artistBio: "Akira Tanaka explores posthuman futures through digital sculpture and installation. With a background in bioengineering and digital art, Tanaka creates works that question the boundaries between human and machine intelligence.",
      exhibitionHistory: ["Post-Human 2023", "Digital Bodies 2022", "Tomorrow's Anatomy 2021"],
      reviews: [
        {
          author: "Digital Sculpture Review",
          text: "Tanaka's work exists in the uncanny valley between the organic and mechanical, forcing us to question our assumptions about what constitutes life.",
          rating: 4.8
        }
      ]
    },
    {
      id: "art15",
      title: "Whispering Reeds",
      artist: "Sophia Lin",
      description: "A minimalist wetland scene focusing on the gentle movement of reeds and the play of light on water's surface at dawn. Lin's delicate watercolor technique perfectly captures the transparency of morning light and the subtle motion of plants in the breeze.",
      year: "2022",
      medium: "Watercolor on paper",
      dimensions: "24 × 36 inches",
      price: 1100,
      currency: "USD",
      forSale: true,
      limited: false,
      categories: ["landscape", "minimalist", "nature"],
      tags: ["wetland", "reeds", "dawn", "water"],
      imageUrl: "/assets/imgs/img15.jpg",
      artistBio: "Sophia Lin's watercolor paintings focus on quiet natural moments often overlooked. Her minimalist approach emphasizes the subtle interplay of light, water, and botanical elements, creating meditative spaces for contemplation.",
      exhibitionHistory: ["Stillness in Nature 2022", "Watercolor Horizons 2021"],
      reviews: [
        {
          author: "Nature in Art Journal",
          text: "Lin's minimalist approach doesn't simplify nature but rather focuses our attention on its intricate subtleties.",
          rating: 4.5
        }
      ]
    },
    {
      id: "art16",
      title: "Fragmented Identity",
      artist: "Julian Ross",
      description: "A conceptual portrait exploring themes of digital identity and surveillance, with a face composed of data fragments and scanning elements. This piece comments on how our identities are increasingly mediated through digital systems and algorithms.",
      year: "2023",
      medium: "Mixed media on canvas",
      dimensions: "36 × 36 inches",
      price: 2400,
      currency: "USD",
      forSale: true,
      limited: true,
      edition: "Original",
      categories: ["portrait", "conceptual", "technology"],
      tags: ["identity", "surveillance", "digital", "data"],
      imageUrl: "/assets/imgs/img16.jpg",
      artistBio: "Julian Ross examines the impact of surveillance capitalism on personal identity. Combining traditional portraiture with digital elements, his work visualizes how data collection and algorithmic systems fragment and reconstruct human identity.",
      exhibitionHistory: ["Data Self 2023", "Surveillance & Society 2022", "Digital Identity 2021"],
      reviews: [
        {
          author: "Digital Art Critique",
          text: "Ross provides one of the most visually compelling interpretations of how digital surveillance reshapes human identity in the 21st century.",
          rating: 4.7
        }
      ]
    },
    {
      id: "art17",
      title: "Ancient Echoes",
      artist: "Amara Okafor",
      description: "A textured abstract piece inspired by ancient cave paintings and petroglyphs, connecting contemporary art to its earliest human roots. Okafor uses earth pigments and textural elements to create a dialogue between prehistoric artistic expression and contemporary abstraction.",
      year: "2022",
      medium: "Mixed media on textured panel",
      dimensions: "40 × 30 inches",
      price: 3000,
      currency: "USD",
      forSale: true,
      limited: false,
      categories: ["abstract", "historical", "textural"],
      tags: ["ancient", "cave painting", "petroglyph", "texture"],
      imageUrl: "/assets/imgs/img17.jpg",
      artistBio: "Amara Okafor's work explores the continuity of human creative expression across millennia. Her research into prehistoric art forms influences her contemporary practice, creating bridges between ancient and modern visual languages.",
      exhibitionHistory: ["Prehistoric Modern 2022", "Ancient Contemporary 2021", "First Marks 2020"],
      reviews: [
        {
          author: "Archaeological Art Review",
          text: "Okafor's work reminds us that abstraction is not merely a modern invention but has roots in humanity's earliest creative expressions.",
          rating: 4.6
        }
      ]
    },
    {
      id: "art18",
      title: "Galactic Birth",
      artist: "Alexandra Chen",
      description: "A spectacular rendering of a galaxy formation, featuring swirling cosmic dust and newborn stars in vibrant colors. This piece visualizes the astrophysical processes that create stellar nurseries and galactic structures.",
      year: "2021",
      medium: "Digital art, printed on metallic paper",
      dimensions: "40 × 40 inches",
      price: 1600,
      currency: "USD",
      forSale: true,
      limited: true,
      edition: "3/12",
      categories: ["space", "digital", "abstract"],
      tags: ["galaxy", "cosmic", "stars", "nebula"],
      imageUrl: "/assets/imgs/img18.jpg",
      artistBio: "Alexandra Chen combines her background in astrophysics with digital art techniques to create scientifically informed visualizations of cosmic phenomena. Her work brings the beauty of deep space processes to audiences who might otherwise never encounter them.",
      exhibitionHistory: ["Cosmic Art 2022", "Digital Universe 2021", "Stellar 2020"],
      reviews: [
        {
          author: "Astronomy & Art",
          text: "Chen's work demonstrates how scientific understanding can enhance rather than diminish our sense of wonder at cosmic processes.",
          rating: 4.9
        }
      ]
    },
    {
      id: "art19",
      title: "Industrial Revolution",
      artist: "Thomas Miller",
      description: "A powerful scene depicting the historical transformation brought by the Industrial Revolution, with dramatic lighting and atmospheric smoke. Miller's painting captures both the technological achievement and the environmental impact of early industrialization.",
      year: "2022",
      medium: "Oil on canvas",
      dimensions: "48 × 36 inches",
      price: 2800,
      currency: "USD",
      forSale: true,
      limited: false,
      categories: ["historical", "industrial", "realism"],
      tags: ["industrial revolution", "factory", "historical", "smoke"],
      imageUrl: "/assets/imgs/img19.jpg",
      artistBio: "Thomas Miller specializes in historical industrial scenes that explore the relationship between technological progress, labor, and environmental impact. His work serves as both historical documentation and contemporary commentary.",
      exhibitionHistory: ["Industry & Progress 2022", "Machine Age 2021", "Labor & Capital 2020"],
      reviews: [
        {
          author: "Historical Art Review",
          text: "Miller's Industrial Revolution offers a nuanced view of technological transformation, celebrating innovation while acknowledging its human and environmental costs.",
          rating: 4.5
        }
      ]
    },
    {
      id: "art20",
      title: "Tranquil Shore",
      artist: "Emily Carter",
      description: "A serene coastal landscape capturing the peaceful moment of sunset over a secluded beach, with detailed wave patterns and reflection on wet sand. Carter's masterful handling of light creates an almost photographic realism while maintaining the emotional resonance of the scene.",
      year: "2023",
      medium: "Oil on canvas",
      dimensions: "30 × 40 inches",
      price: 1900,
      currency: "USD",
      forSale: true,
      limited: false,
      categories: ["landscape", "seascape", "realism"],
      tags: ["beach", "sunset", "ocean", "tranquil"],
      imageUrl: "/assets/imgs/img20.jpg",
      artistBio: "Emily Carter's coastal landscapes capture the psychological and emotional aspects of the meeting point between land and water. Her work focuses on moments of transition—sunset, dawn, approaching storms—as metaphors for human emotional states.",
      exhibitionHistory: ["Coastal Light 2023", "Seascapes 2022", "Horizon Lines 2021"],
      reviews: [
        {
          author: "Contemporary Landscape Art",
          text: "Carter's beaches are never merely picturesque; they are psychological spaces where viewers are invited to project their own emotional states.",
          rating: 4.7
        }
      ]
    },
    {
      id: "art21",
      title: "Subconscious Jungle",
      artist: "Elena Rodriguez",
      description: "A dreamlike jungle scene merging realistic flora with surreal elements, representing the subconscious mind's wild and untamed landscape. Rodriguez blends botanical accuracy with fantastical elements to create an environment that exists between reality and dream.",
      year: "2021",
      medium: "Acrylic and digital mixed media",
      dimensions: "36 × 48 inches",
      price: 2400,
      currency: "USD",
      forSale: true,
      limited: true,
      edition: "Original",
      categories: ["surrealism", "nature", "psychological"],
      tags: ["jungle", "subconscious", "dream", "surreal"],
      imageUrl: "/assets/imgs/img21.jpg",
      artistBio: "Elena Rodriguez explores the psychological dimensions of natural environments. Drawing from both botanical studies and depth psychology, her work visualizes the parallels between external wilderness and the internal landscape of the human mind.",
      exhibitionHistory: ["Mind Ecology 2022", "Inner Wilderness 2021", "Flora of the Subconscious 2020"],
      reviews: [
        {
          author: "Surrealism Today",
          text: "Rodriguez's jungle scenes use the vocabulary of natural environments to map the topography of the human unconscious.",
          rating: 4.6
        }
      ]
    }
  ];
  
  export default artworkData;