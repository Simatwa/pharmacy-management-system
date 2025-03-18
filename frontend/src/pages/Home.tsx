import React, { useEffect, useState } from 'react';
import { Search, ShoppingCart, Filter, Package, RefreshCw, Heart, Pill } from 'lucide-react';
import { api } from '../lib/axios';
import { Medicine } from '../lib/types';
import { useCartStore } from '../store/useCartStore';
import { MedicineModal } from '../components/MedicineModal';
import toast from 'react-hot-toast';

export default function Home() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [priceFilter, setPriceFilter] = useState<number | ''>('');
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);
  const addToCart = useCartStore((state) => state.addItem);

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const response = await api.get('/v1/medicine', {
          params: {
            name: search || undefined,
            category: category || undefined,
            price: priceFilter || undefined,
            limit: 100,
          },
        });
        setMedicines(response.data);
      } catch (error) {
        console.error('Failed to fetch medicines:', error);
        toast.error('Failed to load medicines');
      } finally {
        setLoading(false);
      }
    };

    fetchMedicines();
  }, [search, category, priceFilter]);

  const handleAddToCart = (medicine: Medicine) => {
    addToCart(medicine, 1);
    toast.success(`Added ${medicine.name} to cart`);
  };

  const handleReset = () => {
    setSearch('');
    setCategory('');
    setPriceFilter('');
  };

  return (
    <>
      {/* Hero Section */}
      <div 
        className="relative bg-cover bg-center py-24"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/media/default/jar-2334.jpg')`,
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-6">
            <Pill className="h-16 w-16 text-red-500" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Your Trusted Healthcare Partner
          </h1>
          <p className="text-xl text-white max-w-2xl mx-auto mb-8">
            Access quality medicines and expert healthcare services from the comfort of your home. 
            We ensure safe, reliable, and prompt delivery of your medical needs.
          </p>
          <div className="flex justify-center space-x-4">
            <button 
              onClick={() => document.getElementById('search-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-red-600 text-white px-8 py-3 rounded-md font-medium hover:bg-red-700 transition-colors"
            >
              Browse Medicines
            </button>
          </div>
        </div>
      </div>

      <div id="search-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8 -mt-16 relative z-10">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search medicines..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-lg"
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative min-w-[200px]">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 appearance-none bg-white text-lg"
                >
                  <option value="">All Categories</option>
                  <option value="Pain Relief">Pain Relief</option>
                  <option value="Antibiotics">Antibiotics</option>
                  <option value="First Aid">First Aid</option>
                  <option value="Vitamins">Vitamins</option>
                  <option value="Supplements">Supplements</option>
                  <option value="Cough Syrup">Cough Syrup</option>
                </select>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">KSh</span>
                <input
                  type="number"
                  placeholder="Max Price"
                  value={priceFilter}
                  onChange={(e) => setPriceFilter(Number(e.target.value) || '')}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-lg"
                />
              </div>
              <button
                onClick={handleReset}
                className="flex items-center justify-center space-x-2 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-600 text-lg"
              >
                <RefreshCw className="h-5 w-5" />
                <span>Reset</span>
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {medicines.map((medicine) => (
              <div
                key={medicine.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer transform hover:-translate-y-1 transition-transform duration-200"
                onClick={() => setSelectedMedicine(medicine)}
              >
                <img
                  src={medicine.picture}
                  alt={medicine.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {medicine.name}
                    </h3>
                    <span className="px-2 py-1 bg-red-100 text-red-600 text-sm rounded-full">
                      {medicine.category}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                    {medicine.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xl font-bold text-red-600">
                        KSh {medicine.price.toLocaleString()}
                      </span>
                      <div className="text-sm text-gray-500 flex items-center mt-1">
                        <Package className="h-4 w-4 mr-1" />
                        <span>Stock: {medicine.stock}</span>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(medicine);
                      }}
                      className="flex items-center space-x-2 bg-yellow-400 text-red-600 px-4 py-2 rounded-md font-medium hover:bg-yellow-300 transition-colors"
                    >
                      <ShoppingCart className="h-5 w-5" />
                      <span>Add</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedMedicine && (
          <MedicineModal
            medicine={selectedMedicine}
            onClose={() => setSelectedMedicine(null)}
          />
        )}
      </div>

      <div className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <Heart className="h-12 w-12 text-red-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Your Health, Our Priority
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Take a moment to breathe and relax. We're here to support your journey to better health with trusted medications and professional care. Your well-being is our commitment.
          </p>
        </div>
      </div>
    </>
  );
}