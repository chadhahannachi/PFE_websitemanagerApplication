import React, { useState, useEffect } from 'react';
import '../../website/faqs/FaqSection.css';
import faqImage from '../../images/faq.webp';
import axios from 'axios';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';

export default function FaqStyleThreeDisplay({ faqs = [], contentType = 'faq', styleKey = 'styleThree', entrepriseId }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [positions, setPositions] = useState({
    sectionName: { top: 0, left: 0 },
    subtitle: { top: 0, left: 0 },
    img: { top: 0, left: 0 },
    faqList: { top: 0, left: 0 },
  });
  const [styles, setStyles] = useState({
    sectionName: { 
      color: '#333333', 
      fontSize: '2rem', 
      fontFamily: 'Arial',
      fontWeight: '700'
    },
    subtitle: {
      color: '#666666',
      fontSize: '1rem',
      fontFamily: 'Arial',
      marginBottom: '40px',
    },
    img: {
      width: '500px',
      height: 'auto',
      borderRadius: '0px',
      src: faqImage
    },
    faqList: {
      width: '600px',
      height: '400px',
      button: {
        color: '#ffffff',
        backgroundColor: '#f59e0b',
        fontSize: '0.9375rem',
        fontFamily: 'Arial',
        borderRadius: '10px',
        hoverColor: '#d97706',
      },
      answer: {
        backgroundColor: '#f59e0b',
        color: '#ffffff',
        fontSize: '15px',
        fontFamily: 'Arial',
      },
    },
  });
  const [texts, setTexts] = useState({
    sectionName: 'Questions Fréquentes',
    subtitle: 'Les questions les plus posés',
  });
  const [faqData, setFaqData] = useState([]);
  const [showImage, setShowImage] = useState(true);
  const [activeIndex, setActiveIndex] = useState(null);

  // Validation functions
  const isValidPosition = (pos) => pos && typeof pos === 'object' && typeof pos.top === 'number' && typeof pos.left === 'number';
  const isValidStyle = (style) => style && typeof style === 'object' && Object.keys(style).length > 0;
  const isValidText = (text) => typeof text === 'string' && text.trim().length > 0;

  // Fetch preferences
  const fetchPreferences = async () => {
    if (!entrepriseId) {
      console.log('entrepriseId not yet available');
      setLoading(false);
      return;
    }

    try {
      console.log(`Fetching preferences for entrepriseId: ${entrepriseId}`);
      console.log(`ContentType: ${contentType}, StyleKey: ${styleKey}`);
      
      const response = await axios.get(
        `http://localhost:5000/preferences/entreprise/${entrepriseId}/preferences`
      );
      console.log('Full response data:', response.data);
      console.log('Preferences structure:', response.data.preferences);
      console.log('Content type preferences:', response.data.preferences?.[contentType]);
      console.log('Style key preferences:', response.data.preferences?.[contentType]?.[styleKey]);
      
      const fetchedPreferences = response.data.preferences?.[contentType]?.[styleKey] || {};
      console.log('Fetched preferences for this style:', fetchedPreferences);

      // Vérifier si des préférences existent
      if (Object.keys(fetchedPreferences).length === 0) {
        console.log('No preferences found for this style, using defaults');
        setLoading(false);
        return;
      }

      // Récupération des positions avec validation
      const newPositions = {
        sectionName: isValidPosition(fetchedPreferences.positions?.sectionName)
          ? fetchedPreferences.positions.sectionName
          : positions.sectionName,
        subtitle: isValidPosition(fetchedPreferences.positions?.subtitle)
          ? fetchedPreferences.positions.subtitle
          : positions.subtitle,
        img: isValidPosition(fetchedPreferences.positions?.img)
          ? fetchedPreferences.positions.img
          : positions.img,
        faqList: isValidPosition(fetchedPreferences.positions?.faqList)
          ? fetchedPreferences.positions.faqList
          : positions.faqList,
      };

      // Récupération des styles avec validation et fusion
      const newStyles = {
        sectionName: isValidStyle(fetchedPreferences.styles?.sectionName)
          ? { ...styles.sectionName, ...fetchedPreferences.styles.sectionName }
          : styles.sectionName,
        subtitle: isValidStyle(fetchedPreferences.styles?.subtitle)
          ? { ...styles.subtitle, ...fetchedPreferences.styles.subtitle }
          : styles.subtitle,
        img: isValidStyle(fetchedPreferences.styles?.img)
          ? { ...styles.img, ...fetchedPreferences.styles.img }
          : styles.img,
        faqList: isValidStyle(fetchedPreferences.styles?.faqList)
          ? { ...styles.faqList, ...fetchedPreferences.styles.faqList }
          : styles.faqList,
      };

      // Récupération des textes avec validation
      const newTexts = {
        sectionName: isValidText(fetchedPreferences.texts?.sectionName)
          ? fetchedPreferences.texts.sectionName
          : texts.sectionName,
        subtitle: isValidText(fetchedPreferences.texts?.subtitle)
          ? fetchedPreferences.texts.subtitle
          : texts.subtitle,
      };

      console.log('Applying positions:', newPositions);
      console.log('Applying styles:', newStyles);
      console.log('Applying texts:', newTexts);
      console.log('FAQ List width:', newStyles.faqList.width);
      console.log('FAQ List height:', newStyles.faqList.height);
      
      setPositions(newPositions);
      setStyles(newStyles);
      setTexts(newTexts);
      
      // Récupération showImage
      if (typeof fetchedPreferences.styles?.faqList?.showImage === 'boolean') {
        setShowImage(fetchedPreferences.styles.faqList.showImage);
      }
    } catch (error) {
      console.error('Error fetching preferences:', error);
      console.error('Error details:', error.response?.data);
      // Don't show error toast for display component, just use defaults
      console.log('Using default styles and texts');
    } finally {
      setLoading(false);
    }
  };

  // Initialize faq data with styles and handle defaults
  useEffect(() => {
    if (faqs.length === 0) {
      // Use default FAQs if none provided
      const defaultFaqs = [
        {
          _id: 'default-1',
          question: 'What is your return policy?',
          answer: 'We offer a 30-day return policy for all our products. Please contact our support team for return instructions.',
          styles: {
            button: styles.faqList.button,
            answer: styles.faqList.answer,
          }
        },
        {
          _id: 'default-2',
          question: 'How long does shipping take?',
          answer: 'Standard shipping takes 3-5 business days. Express shipping is available for 1-2 business days delivery.',
          styles: {
            button: styles.faqList.button,
            answer: styles.faqList.answer,
          }
        },
        {
          _id: 'default-3',
          question: 'Do you offer international shipping?',
          answer: 'Yes, we ship to most countries worldwide. Shipping times and costs vary by location.',
          styles: {
            button: styles.faqList.button,
            answer: styles.faqList.answer,
          }
        },
        {
          _id: 'default-4',
          question: 'How can I contact support?',
          answer: 'You can reach our support team via email, phone, or live chat. We typically respond within 24 hours.',
          styles: {
            button: styles.faqList.button,
            answer: styles.faqList.answer,
          }
        }
      ];
      setFaqData(defaultFaqs);
    } else {
      // Use provided FAQs with styles
      const updatedFaqs = faqs.map((faq) => ({
        ...faq,
        styles: faq.styles || {
          button: styles.faqList.button,
          answer: styles.faqList.answer,
        },
      }));
      setFaqData(updatedFaqs);
    }
  }, [faqs, styles.faqList]);

  useEffect(() => {
    fetchPreferences();
  }, [entrepriseId]);

  // Fonction de debug pour tester la récupération des préférences
  const debugFetchPreferences = async () => {
    console.log('=== DEBUG: Testing preference fetch ===');
    console.log('Current entrepriseId:', entrepriseId);
    console.log('Current contentType:', contentType);
    console.log('Current styleKey:', styleKey);
    
    if (!entrepriseId) {
      console.log('No entrepriseId available');
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:5000/preferences/entreprise/${entrepriseId}/preferences`
      );
      console.log('=== DEBUG: Full API Response ===');
      console.log(response.data);
      
      // Test avec différents contentType et styleKey
      const testCases = [
        { contentType: 'faq', styleKey: 'styleThree' },
        { contentType: 'faq', styleKey: 'styleOne' },
        { contentType: 'faq', styleKey: 'styleTwo' },
      ];
      
      for (const testCase of testCases) {
        const testPrefs = response.data.preferences?.[testCase.contentType]?.[testCase.styleKey];
        console.log(`=== DEBUG: Testing ${testCase.contentType}/${testCase.styleKey} ===`);
        console.log(testPrefs);
        if (testPrefs?.styles?.faqList) {
          console.log(`=== DEBUG: FAQ List dimensions for ${testCase.contentType}/${testCase.styleKey} ===`);
          console.log('Width:', testPrefs.styles.faqList.width);
          console.log('Height:', testPrefs.styles.faqList.height);
        }
      }
    } catch (error) {
      console.error('=== DEBUG: Error testing preferences ===', error);
    }
  };

  const toggleFaq = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (error) {
    return <div>Erreur: {error}</div>;
  }

  return (
    <div className="faq-section faqthree-responsive" style={{ 
      backgroundColor: '#f8f9ff', 
      padding: '80px 20px',
      minHeight: '600px',
      position: 'relative',
      width: '100%'
    }}>
      
      
      <div className="faq-style-three-container" style={{ position: 'relative' }}>
        

        <div 
          className="faq-style-three-wrapper"
          style={{ position: 'relative' }}
        >
          <h1
            className="faq-title faqthree-stack"
            style={{
              position: 'absolute',
              top: positions.sectionName.top,
              left: positions.sectionName.left,
              ...styles.sectionName,
              zIndex: 2
            }}
          >
            {texts.sectionName}
          </h1>

          <p
            className="faq-subtitle faqthree-stack"
            style={{
              position: 'absolute',
              top: positions.subtitle.top,
              left: positions.subtitle.left,
              ...styles.subtitle,
              zIndex: 2
            }}
          >
            {texts.subtitle}
          </p>

          {showImage && (
          <div 
            className="faq-image-wrapper"
            style={{
              position: 'absolute',
              top: positions.img.top,
              left: positions.img.left,
              zIndex: 1
            }}
          >
            <img
              src={styles.img?.src || faqImage}
              alt="FAQ illustration"
              className="faq-image faqthree-image"
              style={{
                width: styles.img.width,
                height: styles.img.height,
                borderRadius: styles.img.borderRadius,
                objectFit: 'cover',
              }}
            />
          </div>
        )}

          <div 
            className="faq-list faqthree-grid"
            style={{
              position: 'absolute',
              top: positions.faqList.top,
              left: positions.faqList.left,
              width: styles.faqList.width || '600px',
              height: styles.faqList.height || '400px',
              zIndex: 2
            }}
          >
            {faqData.map((faq, index) => (
              <div key={faq._id || index} className={`faq-item ${activeIndex === index ? 'active' : ''}`}>
                <button
                  className="faq-question"
                  onClick={() => toggleFaq(index)}
                  style={{
                    color: faq.styles?.button?.color || styles.faqList.button.color,
                    backgroundColor: faq.styles?.button?.backgroundColor || styles.faqList.button.backgroundColor,
                    fontSize: faq.styles?.button?.fontSize || styles.faqList.button.fontSize,
                    fontFamily: faq.styles?.button?.fontFamily || styles.faqList.button.fontFamily,
                    borderRadius: faq.styles?.button?.borderRadius || styles.faqList.button.borderRadius,
                    border: 'none',
                    outline: 'none',
                    width: '100%',
                    padding: '15px 20px',
                    fontWeight: '600',
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    transition: 'background-color 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor =
                      faq.styles?.button?.hoverColor || styles.faqList.button.hoverColor;
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor =
                      faq.styles?.button?.backgroundColor || styles.faqList.button.backgroundColor;
                  }}
                >
                  <span>{faq.question}</span>
                  <span className="faq-toggle">{activeIndex === index ? '-' : '+'}</span>
                </button>
                <div
                  className="faq-answer"
                  style={{
                    backgroundColor: faq.styles?.answer?.backgroundColor || styles.faqList.answer.backgroundColor,
                    color: faq.styles?.answer?.color || styles.faqList.answer.color,
                    fontSize: faq.styles?.answer?.fontSize || styles.faqList.answer.fontSize,
                    fontFamily: faq.styles?.answer?.fontFamily || styles.faqList.answer.fontFamily,
                  }}
                >
                  <p>{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}