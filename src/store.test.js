import { useCharacterStore } from './store';

describe('Character Store', () => {
  beforeEach(() => {
    // Reseta o estado antes de cada teste
    useCharacterStore.setState({
      characters: [],
      currentCharacter: { 
        isPulp: false,
        attributes: { STR: 0, DEX: 0, INT: 0, CON: 0, APP: 0, POW: 0, SIZ: 0, EDU: 0 },
        stats: { hp: 0, maxHp: 0, san: 0, maxSan: 99, mp: 0, maxMp: 0, luck: 0, moveRate: 8 },
        combat: { damageBonus: '0', build: 0, weapons: [] }
      }
    });
  });

  it('deve calcular HP, Bônus de Dano e Corpo (Build) corretamente para personagem normal', () => {
    const store = useCharacterStore.getState();
    store.updateAttributes({
      STR: 60,
      CON: 50,
      SIZ: 70,
      POW: 50,
      DEX: 50
    });

    const newState = useCharacterStore.getState().currentCharacter;
    
    // HP = (CON 50 + SIZ 70) / 10 = 12
    expect(newState.stats.maxHp).toBe(12);
    expect(newState.stats.hp).toBe(12);
    
    // STR 60 + SIZ 70 = 130 -> damageBonus: +1D4, build: 1
    expect(newState.combat.damageBonus).toBe('+1D4');
    expect(newState.combat.build).toBe(1);
    
    // Sanidade inicial = POW 50
    expect(newState.stats.san).toBe(50);
  });
});
