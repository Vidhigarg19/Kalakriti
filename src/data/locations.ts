export interface StructuredLocation {
  city: string;
  state: string;
  region: 'North' | 'West' | 'Central' | 'East' | 'South' | 'North-East';
  popularCrafts: string[];
}

export const panIndiaLocations: StructuredLocation[] = [
  // North
  { city: 'Jaipur', state: 'Rajasthan', region: 'North', popularCrafts: ['Blue Pottery', 'Block Printing', 'Gemstone Crafts'] },
  { city: 'Jodhpur', state: 'Rajasthan', region: 'North', popularCrafts: ['Wooden Furniture', 'Bandhani'] },
  { city: 'Udaipur', state: 'Rajasthan', region: 'North', popularCrafts: ['Miniature Painting', 'Marble Inlay'] },
  { city: 'Varanasi', state: 'Uttar Pradesh', region: 'North', popularCrafts: ['Banarasi Silk Weaving', 'Wooden Toys'] },
  { city: 'Lucknow', state: 'Uttar Pradesh', region: 'North', popularCrafts: ['Chikankari Embroidery', 'Zardozi'] },
  { city: 'Srinagar', state: 'Jammu & Kashmir', region: 'North', popularCrafts: ['Pashmina Weaving', 'Paper Mache', 'Carved Walnut Wood'] },
  { city: 'Amritsar', state: 'Punjab', region: 'North', popularCrafts: ['Phulkari Embroidery', 'Jutti Craft'] },
  { city: 'Delhi', state: 'Delhi', region: 'North', popularCrafts: ['Zardozi Embroidery', 'Brassware'] },
  { city: 'Shimla', state: 'Himachal Pradesh', region: 'North', popularCrafts: ['Kullu Shawls', 'Wooden Artifacts'] },
  { city: 'Dehradun', state: 'Uttarakhand', region: 'North', popularCrafts: ['Bamboo Weaving', 'Wood Carving'] },
  { city: 'Rishikesh', state: 'Uttarakhand', region: 'North', popularCrafts: ['Rudraksha Crafts', 'Handmade Paper'] },
  { city: 'Haridwar', state: 'Uttarakhand', region: 'North', popularCrafts: ['Brass & Copper Utensils'] },
  { city: 'Kalsi', state: 'Uttarakhand', region: 'North', popularCrafts: ['Handwoven Mountain Wool Shawls'] },
  { city: 'Dunda', state: 'Uttarakhand', region: 'North', popularCrafts: ['Bhotia Woolen Stoles'] },
  { city: 'Nainital', state: 'Uttarakhand', region: 'North', popularCrafts: ['Decorative Candles', 'Pinecone Crafts'] },

  // West
  { city: 'Ahmedabad', state: 'Gujarat', region: 'West', popularCrafts: ['Patola Weaving', 'Kutch Embroidery'] },
  { city: 'Kutch', state: 'Gujarat', region: 'West', popularCrafts: ['Ajrakh Block Print', 'Rogan Painting'] },
  { city: 'Mumbai', state: 'Maharashtra', region: 'West', popularCrafts: ['Leather Craft', 'Textile Printing'] },
  { city: 'Pune', state: 'Maharashtra', region: 'West', popularCrafts: ['Paithani Sarees', 'Copper Craft'] },
  { city: 'Goa', state: 'Goa', region: 'West', popularCrafts: ['Terracotta Pottery', 'Shell Craft'] },

  // Central
  { city: 'Bhopal', state: 'Madhya Pradesh', region: 'Central', popularCrafts: ['Dhokra Metalcraft', 'Zardozi Embroidery'] },
  { city: 'Indore', state: 'Madhya Pradesh', region: 'Central', popularCrafts: ['Maheshwari Weaving', 'Batik Print'] },
  { city: 'Chanderi', state: 'Madhya Pradesh', region: 'Central', popularCrafts: ['Chanderi Silk Sarees'] },
  { city: 'Raipur', state: 'Chhattisgarh', region: 'Central', popularCrafts: ['Bastar Iron Craft', 'Terracotta'] },

  // East
  { city: 'Madhubani', state: 'Bihar', region: 'East', popularCrafts: ['Madhubani Folk Painting', 'Sikki Grass Craft'] },
  { city: 'Patna', state: 'Bihar', region: 'East', popularCrafts: ['Tikuli Art', 'Stone Carving'] },
  { city: 'Kolkata', state: 'West Bengal', region: 'East', popularCrafts: ['Kantha Embroidery', 'Terracotta Bankura'] },
  { city: 'Bhubaneswar', state: 'Odisha', region: 'East', popularCrafts: ['Pattachitra Painting', 'Applique Work'] },
  { city: 'Puri', state: 'Odisha', region: 'East', popularCrafts: ['Palm Leaf Engraving', 'Stone Sculptures'] },
  { city: 'Ranchi', state: 'Jharkhand', region: 'East', popularCrafts: ['Pyhkar Painting', 'Bamboo Craft'] },

  // South
  { city: 'Kanchipuram', state: 'Tamil Nadu', region: 'South', popularCrafts: ['Kanjivaram Silk Weaving'] },
  { city: 'Madurai', state: 'Tamil Nadu', region: 'South', popularCrafts: ['Sungudi Sarees', 'Bronze Casting'] },
  { city: 'Bengaluru', state: 'Karnataka', region: 'South', popularCrafts: ['Silk Weaving', 'Sandalwood Carving'] },
  { city: 'Channapatna', state: 'Karnataka', region: 'South', popularCrafts: ['Lacquer Wooden Toys'] },
  { city: 'Bidar', state: 'Karnataka', region: 'South', popularCrafts: ['Bidriware Metal Inlay'] },
  { city: 'Hyderabad', state: 'Telangana', region: 'South', popularCrafts: ['Pochampally Ikat', 'Pearls & Bidri'] },
  { city: 'Srikalahasti', state: 'Andhra Pradesh', region: 'South', popularCrafts: ['Kalamkari Hand Painting'] },
  { city: 'Kochi', state: 'Kerala', region: 'South', popularCrafts: ['Coir Crafts', 'Brass Lamps'] },

  // North-East
  { city: 'Guwahati', state: 'Assam', region: 'North-East', popularCrafts: ['Muga Silk Weaving', 'Cane & Bamboo'] },
  { city: 'Shillong', state: 'Meghalaya', region: 'North-East', popularCrafts: ['Cane Baskets', 'Eri Silk'] },
  { city: 'Imphal', state: 'Manipur', region: 'North-East', popularCrafts: ['Shaphee Lanphee Weaving', 'Kauna Reed Crafts'] },
  { city: 'Kohima', state: 'Nagaland', region: 'North-East', popularCrafts: ['Naga Tribal Weaving', 'Wood Carvings'] },
  { city: 'Gangtok', state: 'Sikkim', region: 'North-East', popularCrafts: ['Thangka Painting', 'Choktse Wooden Tables'] },
];

export const POPULAR_SEARCH_CRAFTS = [
  'Blue Pottery',
  'Pashmina Shawl',
  'Banarasi Silk',
  'Madhubani Painting',
  'Kanjivaram Silk',
  'Chikankari',
  'Dhokra Metalcraft',
  'Phulkari',
  'Bamboo Craft',
  'Mountain Wool',
];

export const POPULAR_SEARCH_LOCATIONS = [
  'Jaipur, Rajasthan',
  'Varanasi, Uttar Pradesh',
  'Srinagar, Jammu & Kashmir',
  'Madhubani, Bihar',
  'Kanchipuram, Tamil Nadu',
  'Dehradun, Uttarakhand',
  'Bhopal, Madhya Pradesh',
  'Kolkata, West Bengal',
  'Amritsar, Punjab',
];
