import { AnimatePresence, MotiText, MotiView } from 'moti';
import { BowlFood } from 'phosphor-react-native';
import React, { useEffect, useState } from 'react';
import { Dimensions, StyleSheet } from 'react-native';

const { width } = Dimensions.get('window');

interface AnimatedSplashScreenProps {
  onAnimationFinish: () => void;
}

export function AnimatedSplashScreen({ onAnimationFinish }: AnimatedSplashScreenProps) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      setTimeout(onAnimationFinish, 500);
    }, 2500);

    return () => clearTimeout(timer);
  }, [onAnimationFinish]);

  return (
    <AnimatePresence>
      {show && (
        <MotiView
          from={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ type: 'timing', duration: 500 }}
          style={styles.container}
        >
          {/* Animação do Ícone Vetorial (Salto) */}
          <MotiView
            from={{ scale: 0, translateY: 100 }}
            animate={{ scale: 1, translateY: 0 }}
            transition={{ type: 'spring', damping: 12, stiffness: 100 }}
          >
            <MotiView
               animate={{ 
                 translateY: [0, -30, 0],
                 rotate: ['0deg', '8deg', '0deg']
               }}
               transition={{
                 loop: true,
                 duration: 1500,
                 type: 'timing',
               }}
            >
              <BowlFood 
                size={width * 0.4} 
                color="#FFF" 
                weight="fill"
              />
            </MotiView>
          </MotiView>

          {/* Animação do Texto */}
          <MotiText
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ delay: 600, type: 'timing', duration: 800 }}
            style={styles.title}
          >
            FoodClub
          </MotiText>
        </MotiView>
      )}
    </AnimatePresence>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#FF6D00',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 99999,
  },
  title: {
    fontSize: 52,
    fontWeight: 'bold',
    color: '#FFF',
    marginTop: 10,
    letterSpacing: 3,
    fontFamily: 'Roboto_700Bold',
  },
});
