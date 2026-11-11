import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Componente individual para cada cartão de produto com gestão de hover integrada
function ProductCard({ product, onAddToCart }) {
  const [isCardHovered, setIsCardHovered] = useState(false);
  const [isBtnHovered, setIsBtnHovered] = useState(false);

  return (
    <div 
      style={{
        ...styles.card,
        transform: isCardHovered ? 'translateY(-6px)' : 'translateY(0)',
        boxShadow: isCardHovered 
          ? '0 12px 20px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.05)' 
          : '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05)'
      }}
      onMouseEnter={() => setIsCardHovered(true)}
      onMouseLeave={() => setIsCardHovered(false)}
    >
      <div style={styles.cardImageContainer}>
        {product.image ? (
          <img src={product.image} alt={product.name} style={styles.productImage} />
        ) : (
          <span style={styles.placeholderIcon}>📦</span>
        )}
        {product.category && <span style={styles.categoryTag}>{product.category}</span>}
      </div>
      
      <div style={styles.cardBody}>
        <div style={styles.cardTopInfo}>
          <h3 style={styles.productName}>{product.name}</h3>
          {product.rating && (
            <span style={styles.ratingBadge}>★ {product.rating.toFixed(1)}</span>
          )}
        </div>
        <p style={styles.productDescription}>
          {product.description || 'Produto de alta qualidade com garantia e envio rápido.'}
        </p>
        {product.stock !== undefined && (
          <span style={{
            ...styles.stockIndicator,
            color: product.stock > 10 ? '#059669' : '#d97706'
          }}>
            ● {product.stock > 10 ? 'Em Stock' : `Apenas ${product.stock} restantes`}
          </span>
        )}
      </div>

      <div style={styles.cardFooter}>
        <div style={styles.priceTag}>
          R$ {product.price ? product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : '0,00'}
        </div>
        <button 
          onClick={onAddToCart}
          onMouseEnter={() => setIsBtnHovered(true)}
          onMouseLeave={() => setIsBtnHovered(false)}
          style={{
            ...styles.buyButton,
            backgroundColor: isBtnHovered ? '#dc2626' : '#4f46e5',
            boxShadow: isBtnHovered ? '0 4px 12px rgba(220, 38, 38, 0.3)' : '0 2px 4px rgba(79, 70, 229, 0.2)'
          }}
        >
          Adicionar
        </button>
      </div>
    </div>
  );
}

export default function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    axios.get('http://localhost:5000/api/products')
      .then(response => {
        setProducts(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Erro ao buscar produtos:', error);
        setLoading(false);
      });
  }, []);

  const categories = ['Todos', ...new Set(products.map(p => p.category).filter(Boolean))];

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'Todos' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddToCart = () => {
    setCartCount(prev => prev + 1);
  };

  return (
    <div style={styles.page}>
      {/* Navbar Superior */}
      <header style={styles.navbar}>
        <div style={styles.navContainer}>
          <div style={styles.brandGroup}>
            <span style={styles.brandLogo}>✨</span>
            <span style={styles.brandName}>SimpleMarket</span>
          </div>
          <div style={styles.navSearchWrapper}>
            <input 
              type="text" 
              placeholder="Pesquisar produtos no catálogo..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={styles.searchInput}
            />
          </div>
          <div style={styles.cartBadge}>
            🛒 Carrinho <span style={styles.badgeCount}>{cartCount}</span>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main style={styles.mainContent}>
        <div style={styles.heroSection}>
          <h1 style={styles.heroTitle}>Descubra Produtos Incríveis</h1>
          <p style={styles.heroSubtitle}>O seu catálogo inteligente com as melhores ofertas em tempo real.</p>
        </div>

        {/* Filtros por Categoria */}
        <div style={styles.categoriesBar}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                ...styles.categoryBtn,
                ...(selectedCategory === cat ? styles.categoryBtnActive : {})
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>
            {selectedCategory === 'Todos' ? 'Todos os Produtos' : `Categoria: ${selectedCategory}`}
          </h2>
          <span style={styles.resultsCount}>{filteredProducts.length} itens encontrados</span>
        </div>

        {loading ? (
          <div style={styles.statusBox}>A carregar o catálogo completo...</div>
        ) : filteredProducts.length === 0 ? (
          <div style={styles.statusBox}>Nenhum produto corresponde aos critérios selecionados.</div>
        ) : (
          <div style={styles.productGrid}>
            {filteredProducts.map(product => (
              <ProductCard 
                key={product._id} 
                product={product} 
                onAddToCart={handleAddToCart} 
              />
            ))}
          </div>
        )}
      </main>

      <footer style={styles.footer}>
        <p>© 2026 SimpleMarket Engine. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}

// Estilos Atualizados (Fundo dos cartões em tom off-white/suave contrastante)
const styles = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#f1f5f9', // Fundo geral um pouco mais texturizado
    color: '#0f172a',
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
    display: 'flex',
    flexDirection: 'column',
  },
  navbar: {
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #e2e8f0',
    padding: '16px 24px',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
  },
  navContainer: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '20px',
  },
  brandGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  brandLogo: {
    fontSize: '1.5rem',
  },
  brandName: {
    fontSize: '1.35rem',
    fontWeight: '800',
    letterSpacing: '-0.5px',
    color: '#4f46e5',
  },
  navSearchWrapper: {
    flex: 1,
    maxWidth: '420px',
  },
  searchInput: {
    width: '100%',
    padding: '10px 16px',
    borderRadius: '10px',
    border: '1px solid #cbd5e1',
    backgroundColor: '#ffffff',
    color: '#0f172a',
    fontSize: '0.95rem',
    outline: 'none',
  },
  cartBadge: {
    backgroundColor: '#e0e7ff',
    color: '#3730a3',
    padding: '8px 16px',
    borderRadius: '10px',
    fontSize: '0.9rem',
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
    border: '1px solid #c7d2fe',
  },
  badgeCount: {
    backgroundColor: '#4f46e5',
    color: '#ffffff',
    padding: '2px 8px',
    borderRadius: '12px',
    fontSize: '0.75rem',
    fontWeight: '800',
  },
  mainContent: {
    flex: 1,
    maxWidth: '1200px',
    width: '100%',
    margin: '0 auto',
    padding: '40px 24px',
  },
  heroSection: {
    textAlign: 'center',
    marginBottom: '35px',
  },
  heroTitle: {
    fontSize: '2.5rem',
    fontWeight: '800',
    marginBottom: '10px',
    letterSpacing: '-1px',
    color: '#0f172a',
  },
  heroSubtitle: {
    color: '#64748b',
    fontSize: '1.1rem',
  },
  categoriesBar: {
    display: 'flex',
    gap: '10px',
    overflowX: 'auto',
    paddingBottom: '15px',
    marginBottom: '20px',
  },
  categoryBtn: {
    backgroundColor: '#ffffff',
    color: '#475569',
    border: '1px solid #e2e8f0',
    padding: '8px 18px',
    borderRadius: '20px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '0.9rem',
    whiteSpace: 'nowrap',
    transition: 'all 0.2s',
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03)',
  },
  categoryBtnActive: {
    backgroundColor: '#4f46e5',
    color: '#ffffff',
    borderColor: '#4f46e5',
    boxShadow: '0 4px 6px -1px rgba(79, 70, 229, 0.25)',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    borderBottom: '2px solid #e2e8f0',
    paddingBottom: '14px',
    marginBottom: '30px',
  },
  sectionTitle: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#0f172a',
  },
  resultsCount: {
    color: '#64748b',
    fontSize: '0.9rem',
    fontWeight: '500',
  },
  statusBox: {
    textAlign: 'center',
    padding: '60px',
    color: '#64748b',
    fontSize: '1.1rem',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    border: '1px dashed #cbd5e1',
  },
  productGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '24px',
  },
  card: {
    backgroundColor: '#ffffff', // Fundo interno branco nos compartimentos dos produtos
    borderRadius: '14px',
    border: '1px solid #e2e8f0',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.25s ease, box-shadow 0.25s ease', // Suavidade na transição de sobrelevação
    cursor: 'pointer',
  },
  cardImageContainer: {
    height: '190px',
    backgroundColor: '#f8fafc', // Tom de branco ligeiramente mais escuro/suave para a moldura da imagem
    position: 'relative',
    overflow: 'hidden',
    borderBottom: '1px solid #f1f5f9',
  },
  productImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  categoryTag: {
    position: 'absolute',
    top: '12px',
    left: '12px',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    color: '#4f46e5',
    padding: '4px 10px',
    borderRadius: '6px',
    fontSize: '0.75rem',
    fontWeight: '700',
    border: '1px solid #e2e8f0',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
  },
  placeholderIcon: {
    fontSize: '2.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  cardBody: {
    padding: '20px',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  cardTopInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '10px',
  },
  productName: {
    fontSize: '1.1rem',
    fontWeight: '700',
    color: '#0f172a',
    margin: 0,
  },
  ratingBadge: {
    backgroundColor: '#fef3c7',
    color: '#d97706',
    padding: '2px 8px',
    borderRadius: '6px',
    fontSize: '0.8rem',
    fontWeight: '700',
    whiteSpace: 'nowrap',
    border: '1px solid #fde68a',
  },
  productDescription: {
    color: '#64748b',
    fontSize: '0.88rem',
    lineHeight: '1.5',
    margin: 0,
  },
  stockIndicator: {
    fontSize: '0.8rem',
    fontWeight: '600',
    marginTop: '4px',
  },
  cardFooter: {
    padding: '16px 20px',
    backgroundColor: '#f8fafc', // Contraste suave no rodapé do cartão
    borderTop: '1px solid #e2e8f0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceTag: {
    fontSize: '1.2rem',
    fontWeight: '800',
    color: '#0f172a',
  },
  buyButton: {
    color: '#ffffff',
    border: 'none',
    padding: '9px 18px',
    borderRadius: '8px',
    fontWeight: '700',
    fontSize: '0.9rem',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease, box-shadow 0.2s ease', // Transição fluida para o vermelho ao passar o rato
  },
  footer: {
    textAlign: 'center',
    padding: '24px',
    borderTop: '1px solid #e2e8f0',
    color: '#94a3b8',
    fontSize: '0.85rem',
    backgroundColor: '#ffffff',
  },
};