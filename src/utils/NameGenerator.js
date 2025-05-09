
const maleNames = ['João', 'Pedro', 'Lucas', 'Miguel', 'Arthur', 'Gabriel', 'Bernardo', 'Rafael', 'Gustavo'];
const femaleNames = ['Maria', 'Ana', 'Julia', 'Laura', 'Sofia', 'Isabella', 'Helena', 'Valentina', 'Alice'];
const lastNames = ['Silva', 'Santos', 'Oliveira', 'Souza', 'Rodrigues', 'Ferreira', 'Alves', 'Lima', 'Pereira'];

export class NameGenerator {
    static generateName(gender) {
        const names = gender === 'male' ? maleNames : femaleNames;
        const firstName = names[Math.floor(Math.random() * names.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        return `${firstName} ${lastName}`;
    }
}
