import React, { useState, useEffect } from 'react';
import axios from 'axios';

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

  // Extrair categorias únicas para os filtros
  const categories = ['Todos', ...new Set(products.map(p => p.category).filter(Boolean))];

  // Filtragem combinada por nome/descrição e categoria
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
            <span style={styles.brandLogo}>⚡</span>
            <span style={styles.brandName}>NexusStore</span>
          </div>
          <div style={styles.navSearchWrapper}>
            <input 
              type="text" 
              placeholder="Pesquisar no catálogo completo..." 
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
          <h1 style={styles.heroTitle}>Tecnologia de Ponta & Performance</h1>
          <p style={styles.heroSubtitle}>Explore o nosso inventário avançado sincronizado em tempo real com MongoDB.</p>
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
            {selectedCategory === 'Todos' ? 'Catálogo Geral' : `Categoria: ${selectedCategory}`}
          </h2>
          <span style={styles.resultsCount}>{filteredProducts.length} produtos disponíveis</span>
        </div>

        {loading ? (
          <div style={styles.statusBox}>A sincronizar dados da base de dados...</div>
        ) : filteredProducts.length === 0 ? (
          <div style={styles.statusBox}>Nenhum produto encontrado para os critérios selecionados.</div>
        ) : (
          <div style={styles.productGrid}>
            {filteredProducts.map(product => (
              <div key={product._id} style={styles.card}>
                <div style={styles.cardImageContainer}>
                  {product.category && <span style={styles.categoryTag}>{product.category}</span>}
                  <span style={styles.placeholderIcon}>💻</span>
                </div>
                <div style={styles.cardBody}>
                  <div style={styles.cardTopInfo}>
                    <h3 style={styles.productName}>{product.name}</h3>
                    {product.rating && (
                      <span style={styles.ratingBadge}>★ {product.rating}</span>
                    )}
                  </div>
                  <p style={styles.productDescription}>
                    {product.description || 'Produto de alta performance com garantia e suporte integrado.'}
                  </p>
                  {product.stock !== undefined && (
                    <span style={{
                      ...styles.stockIndicator,
                      color: product.stock > 10 ? '#34d399' : '#fbbf24'
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
                    onClick={handleAddToCart}
                    style={styles.buyButton}
                  >
                    Adicionar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer style={styles.footer}>
        <p>© 2026 NexusStore Full-Stack Engine. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}

// Estilos do Design System Próprio
const styles = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#0f172a',
    color: '#f8fafc',
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
    display: 'flex',
    flexDirection: 'column',
  },
  navbar: {
    backgroundColor: '#1e293b',
    borderBottom: '1px solid #334155',
    padding: '16px 24px',
    position: 'sticky',
    top: 0,
    zIndex: 100,
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
    fontSize: '1.25rem',
    fontWeight: '700',
    letterSpacing: '-0.5px',
    color: '#38bdf8',
  },
  navSearchWrapper: {
    flex: 1,
    maxWidth: '400px',
  },
  searchInput: {
    width: '100%',
    padding: '10px 16px',
    borderRadius: '8px',
    border: '1px solid #475569',
    backgroundColor: '#0f172a',
    color: '#f8fafc',
    fontSize: '0.95rem',
    outline: 'none',
  },
  cartBadge: {
    backgroundColor: '#334155',
    padding: '8px 14px',
    borderRadius: '8px',
    fontSize: '0.9rem',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
  },
  badgeCount: {
    backgroundColor: '#38bdf8',
    color: '#0f172a',
    padding: '2px 6px',
    borderRadius: '10px',
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
    color: '#f1f5f9',
  },
  heroSubtitle: {
    color: '#94a3b8',
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
    backgroundColor: '#1e293b',
    color: '#94a3b8',
    border: '1px solid #334155',
    padding: '8px 16px',
    borderRadius: '20px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '0.9rem',
    whiteSpace: 'nowrap',
    transition: 'all 0.2s',
  },
  categoryBtnActive: {
    backgroundColor: '#38bdf8',
    color: '#0f172a',
    borderColor: '#38bdf8',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    borderBottom: '1px solid #334155',
    paddingBottom: '14px',
    marginBottom: '30px',
  },
  sectionTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#f8fafc',
  },
  resultsCount: {
    color: '#64748b',
    fontSize: '0.9rem',
  },
  statusBox: {
    textAlign: 'center',
    padding: '60px',
    color: '#94a3b8',
    fontSize: '1.1rem',
    backgroundColor: '#1e293b',
    borderRadius: '12px',
    border: '1px dashed #475569',
  },
  productGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '24px',
  },
  card: {
    backgroundColor: '#1e293b',
    borderRadius: '12px',
    border: '1px solid #334155',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  cardImageContainer: {
    height: '130px',
    backgroundColor: '#0f172a',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottom: '1px solid #334155',
    position: 'relative',
  },
  categoryTag: {
    position: 'absolute',
    top: '10px',
    left: '12px',
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    color: '#38bdf8',
    padding: '3px 8px',
    borderRadius: '6px',
    fontSize: '0.75rem',
    fontWeight: '700',
  },
  placeholderIcon: {
    fontSize: '2.5rem',
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
    fontSize: '1.15rem',
    fontWeight: '600',
    color: '#f8fafc',
    margin: 0,
  },
  ratingBadge: {
    backgroundColor: 'rgba(251, 191, 36, 0.15)',
    color: '#fbbf24',
    padding: '2px 6px',
    borderRadius: '6px',
    fontSize: '0.8rem',
    fontWeight: '700',
    whiteSpace: 'nowrap',
  },
  productDescription: {
    color: '#94a3b8',
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
    backgroundColor: '#162032',
    borderTop: '1px solid #334155',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceTag: {
    fontSize: '1.15rem',
    fontWeight: '700',
    color: '#34d399',
  },
  buyButton: {
    backgroundColor: '#38bdf8',
    color: '#0f172a',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '6px',
    fontWeight: '700',
    fontSize: '0.9rem',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  footer: {
    textAlign: 'center',
    padding: '24px',
    borderTop: '1px solid #334155',
    color: '#64748b',
    fontSize: '0.85rem',
    backgroundColor: '#1e293b',
  },
};