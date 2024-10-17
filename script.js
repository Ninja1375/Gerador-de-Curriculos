// Inicialmente esconde a div do currículo e o botão de download
document.getElementById('resume').style.display = 'none';
document.getElementById('downloadBtn').style.display = 'none';

let profilePictureBase64 = ""; // Variável para armazenar a imagem em base64

// Função para ajustar a orientação da imagem usando um canvas
function fixImageOrientation(file, callback) {
    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            // Define o tamanho do canvas
            canvas.width = img.width;
            canvas.height = img.height;

            // Desenha a imagem no canvas (remove metadados EXIF)
            ctx.drawImage(img, 0, 0);

            // Converte a imagem para base64
            const base64Image = canvas.toDataURL('image/jpeg');
            callback(base64Image); // Chama o callback com a imagem processada
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

// Pré-visualizar a foto de perfil em tempo real
document.getElementById('uploadPicture').addEventListener('change', function(event) {
    const file = event.target.files[0]; // Obtém o ficheiro selecionado
    if (file) {
        fixImageOrientation(file, function(fixedBase64Image) {
            // Mostra a imagem corrigida no preview e armazena o base64
            document.getElementById('profilePicture').style.backgroundImage = `url(${fixedBase64Image})`;
            profilePictureBase64 = fixedBase64Image; // Armazena a imagem corrigida
        });
    }
});

document.getElementById('resumeForm').addEventListener('submit', function(event) {
    event.preventDefault();

    // Coleta dos dados do formulário
    const name = document.getElementById('name').value;
    const profession = document.getElementById('profession').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const cep = document.getElementById('cep').value;
    const address = document.getElementById('address').value;
    const city = document.getElementById('city').value;
    const state = document.getElementById('state').value;
    const nationality = document.getElementById('nationality').value;
    const age = document.getElementById('age').value;
    const gender = document.getElementById('gender').value;
    const relationship = document.getElementById('relationship').value;
    const experience = document.getElementById('experience').value;
    const education = document.getElementById('education').value;
    const languages = document.getElementById('languages').value;
    const courses = document.getElementById('courses').value;
    const skills = document.getElementById('skills').value;
    const projects = document.getElementById('projects').value;

    // Gera o conteúdo do currículo
    const resumeContent = `
        <div>
            <img src="${profilePictureBase64}" alt="Foto de Perfil" style="width: 100px; height: 100px; border-radius: 50%; object-fit: cover;">
        </div>

        <h2>Informações Pessoais</h2>
        <p><strong>Nome:</strong> ${name}</p>
        <p><strong>Profissão:</strong> ${profession}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Telefone:</strong> ${phone}</p>
        <p><strong>CEP:</strong> ${cep}</p>
        <p><strong>Endereço:</strong> ${address}</p>
        <p><strong>Cidade:</strong> ${city}</p>
        <p><strong>Estado:</strong> ${state}</p>
        <p><strong>Nacionalidade:</strong> ${nationality}</p>
        <p><strong>Idade:</strong> ${age}</p>
        <p><strong>Gênero:</strong> ${gender}</p>
        <p><strong>Relacionamento:</strong> ${relationship}</p>

        <h2>Experiência Profissional</h2>
        <p>${experience}</p>

        <h2>Formação Acadêmica</h2>
        <p>${education}</p>

        <h2>Idiomas</h2>
        <p>${languages}</p>

        <h2>Cursos</h2>
        <p>${courses}</p>

        <h2>Habilidades</h2>
        <p>${skills}</p>

        <h2>Projetos</h2>
        <p>${projects}</p>
    `;

    document.getElementById('resumeContent').innerHTML = resumeContent;
    document.getElementById('resume').style.display = 'block'; // Mostra a div do currículo
    document.getElementById('downloadBtn').style.display = 'block'; // Mostra o botão de download
});

// Função para buscar endereço pelo CEP
document.getElementById('cep').addEventListener('blur', function() {
    const cep = this.value.replace(/\D/g, ''); // Remove caracteres não numéricos
    if (cep.length === 8) {
        fetch(`https://viacep.com.br/ws/${cep}/json/`)
            .then(response => response.json())
            .then(data => {
                if (!data.erro) {
                    document.getElementById('address').value = data.logradouro;
                    document.getElementById('city').value = data.localidade;
                    document.getElementById('state').value = data.uf;
                } else {
                    alert('CEP não encontrado.');
                }
            })
            .catch(error => {
                console.error('Erro ao buscar o CEP:', error);
                alert('Erro ao buscar o CEP. Tente novamente.');
            });
    } else {
        alert('CEP inválido. Deve conter 8 dígitos.');
    }
});

// Função para baixar o currículo estilizado em PDF
document.getElementById('downloadBtn').addEventListener('click', function() {
    const element = document.getElementById('resume'); // Pega o conteúdo da div "resume"

    // Opções básicas para o PDF
    const options = {
        margin:       0.3,
        filename:     'curriculo.pdf',
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 1 },
        jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    // Converte o HTML estilizado em PDF
    html2pdf().from(element).set(options).save();
});
