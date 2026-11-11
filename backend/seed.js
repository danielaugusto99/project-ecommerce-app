const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/ecommerce')
  .then(async () => {
    console.log('Conectado ao MongoDB para popular o catálogo rico...');
    
    const productSchema = new mongoose.Schema({
      name: String,
      price: Number,
      description: String,
      category: String,
      rating: Number,
      stock: Number
    });
    
    const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

    await Product.deleteMany({});
    
    await Product.insertMany([
      {
        name: 'MacBook Pro 16" M3 Max',
        price: 18999.00,
        description: 'Potência extrema com chip M3 Max, 36GB de memória unificada e SSD de 1TB para fluxos de trabalho profissionais.',
        category: 'Computadores',
        rating: 4.9,
        stock: 12
      },
      {
        name: 'Smartphone Nexus Ultra 5G',
        price: 5499.00,
        description: 'Ecrã AMOLED de 6.8 polegadas a 120Hz, câmara quádrupla de 200MP e bateria de longa duração com carregamento rápido.',
        category: 'Telemóveis',
        rating: 4.8,
        stock: 25
      },
      {
        name: 'Headset Gamer Stealth Wireless',
        price: 899.90,
        description: 'Áudio espacial imersivo 7.1, cancelamento de ruído ativo (ANC) e autonomia de até 40 horas contínuas.',
        category: 'Áudio',
        rating: 4.6,
        stock: 40
      },
      {
        name: 'Monitor UltraWide Curvo 34"',
        price: 3299.00,
        description: 'Resolução WQHD, rácio de atualização de 165Hz e tempo de resposta de 1ms ideal para produtividade e gaming imersivo.',
        category: 'Monitores',
        rating: 4.7,
        stock: 8
      },
      {
        name: 'Teclado Mecânico RGB Pro',
        price: 649.00,
        description: 'Switches mecânicos de alta precisão, estrutura em alumínio aeroespacial e iluminação LED personalizável por tecla.',
        category: 'Acessórios',
        rating: 4.5,
        stock: 30
      },
      {
        name: 'Placa Gráfica RTX 5080 Turbo',
        price: 7499.00,
        description: 'Arquitetura de nova geração com Ray Tracing avançado e DLSS impulsionado por inteligência artificial.',
        category: 'Hardware',
        rating: 5.0,
        stock: 5
      }
    ]);

    console.log('Catálogo rico inserido com sucesso!');
    process.exit();
  })
  .catch(err => {
    console.error('Erro no seed:', err);
    process.exit(1);
  });