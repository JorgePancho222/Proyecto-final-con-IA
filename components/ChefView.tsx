import React, { useState, useRef } from 'react';
import { ChefHat, Upload, Clock, Flame, BookOpen, Loader2, ArrowRight } from 'lucide-react';
import { generateRecipesFromIngredients, fileToBase64 } from '../services/geminiService';
import { Recipe } from '../types';

export const ChefView: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImagePreview(URL.createObjectURL(file));
      setRecipes([]);
      setLoading(true);

      try {
        const base64 = await fileToBase64(file);
        const result = await generateRecipesFromIngredients(base64, file.type);
        setRecipes(result);
      } catch (err) {
        console.error(err);
        alert("Error al generar recetas. Intenta con una imagen más clara.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-gray-800">Chef de Despensa</h2>
        <p className="text-gray-600">¿No sabes qué cocinar? Sube una foto de tu nevera o ingredientes y te diré qué hacer.</p>
      </div>

      <div className="flex justify-center mb-8">
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="group relative flex items-center px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
        >
          <Upload className="w-5 h-5 mr-3 group-hover:-translate-y-1 transition-transform" />
          <span className="font-semibold text-lg">{imagePreview ? 'Cambiar Foto' : 'Subir Ingredientes'}</span>
          <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
        </button>
      </div>

      {imagePreview && (
         <div className="flex justify-center mb-8">
            <img src={imagePreview} alt="Ingredients" className="h-48 rounded-xl shadow-md object-cover border-4 border-white" />
         </div>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="w-12 h-12 text-emerald-600 animate-spin mb-4" />
          <p className="text-lg text-gray-600 font-medium">El Chef está pensando recetas deliciosas...</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes.map((recipe, index) => (
          <div key={index} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col">
            <div className="p-6 bg-gradient-to-br from-orange-50 to-orange-100/50">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold text-gray-800 leading-tight">{recipe.title}</h3>
                <span className={`text-xs px-2 py-1 rounded-full font-bold uppercase tracking-wider ${
                  recipe.difficulty === 'Fácil' ? 'bg-green-100 text-green-700' : 
                  recipe.difficulty === 'Media' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                }`}>
                  {recipe.difficulty}
                </span>
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-600 mt-3">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1 text-orange-500" />
                  {recipe.timeMinutes} min
                </div>
                <div className="flex items-center">
                  <Flame className="w-4 h-4 mr-1 text-red-500" />
                  {recipe.calories} kcal
                </div>
              </div>
            </div>
            
            <div className="p-6 flex-grow flex flex-col">
               <div className="mb-4">
                  <h4 className="font-semibold text-gray-700 mb-2 flex items-center">
                    <BookOpen className="w-4 h-4 mr-2 text-emerald-500" /> Ingredientes
                  </h4>
                  <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
                    {recipe.ingredients.slice(0, 5).map((ing, i) => (
                      <li key={i} className="truncate">{ing}</li>
                    ))}
                    {recipe.ingredients.length > 5 && <li className="text-xs text-gray-400">...y más</li>}
                  </ul>
               </div>
               
               <div className="mt-auto pt-4 border-t border-gray-100">
                 <button className="w-full text-left group flex items-center justify-between text-sm font-semibold text-emerald-600 hover:text-emerald-700">
                    <span>Ver Instrucciones</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                 </button>
                 <div className="mt-3 space-y-2 text-xs text-gray-500 hidden group-focus-within:block focus-within:block">
                    {recipe.instructions.map((step, i) => (
                      <p key={i}><span className="font-bold mr-1">{i+1}.</span> {step}</p>
                    ))}
                 </div>
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};