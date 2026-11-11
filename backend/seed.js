const mongoose = require('mongoose');
const axios = require('axios');

mongoose.connect('mongodb://127.0.0.1:27017/ecommerce')
  .then(async () => {
    console.log('Conectado ao MongoDB. A limpar índices antigos e a importar produtos...');
    
    const productSchema = new mongoose.Schema({
      name: String,
      price: Number,
      description: String,
      category: String,
      rating: Number,
      stock: Number,
      image: String
    });
    
    const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

    // Apaga a coleção inteira para remover quaisquer índices órfãos ou restrições antigas
    try {
      await mongoose.connection.collection('products').drop();
      console.log('Coleção antiga e respetivos índices eliminados.');
    } catch (e) {
      console.log('A coleção estava vazia ou não existia.');
    }

    try {
      const response = await axios.get('https://dummyjson.com/products?limit=100');
      const apiProducts = response.data.products;

      const formattedProducts = apiProducts.map(p => ({
        name: p.title,
        price: Number((p.price * 5.5).toFixed(2)),
        description: p.description,
        category: p.category.charAt(0).toUpperCase() + p.category.slice(1),
        rating: p.rating,
        stock: p.stock,
        image: p.thumbnail
      }));

      await Product.insertMany(formattedProducts);
      console.log(`Sucesso! ${formattedProducts.length} produtos inseridos na base de dados.`);
    } catch (error) {
      console.error('Erro ao importar produtos da API:', error.message);
    }

    process.exit();
  })
  .catch(err => {
    console.error('Erro de conexão ao MongoDB:', err);
    process.exit(1);
  });