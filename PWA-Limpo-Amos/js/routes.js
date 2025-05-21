//DADOS BACKEND SERVER
const apiServerUrl = "https://amos.tecskill.com.br/rest.php";
const appId = "Basic 50119e057567b086d83fe5dd18336042ff2cf7bef3c24807bc55e34dbe5a";
const versionApp = "1.0";
var userAuthToken = '';
//INCLUIR ARQUIVO FUNÇÕES
$.getScript('js/funcoes.js');

//INICIALIZAÇÃO DO F7 QUANDO DISPOSITIVO ESTÁ PRONTO
document.addEventListener('deviceready', onDeviceReady, false);
var app = new Framework7({
  // App root element
  el: '#app',
  // App Name
  name: 'My App',
  // App id
  id: 'com.myapp.test',
  // Enable swipe panel
  panel: {
    swipe: false,
  },
  dialog: {
    buttonOk: 'Sim',
    buttonCancel: 'Cancelar',
  },
  // Disable page animations globally
  animate: false,
  // Add default routes
  routes: [
    {
      path: '/index/',
      url: 'index.html',
      on: {
        pageBeforeIn: async function (event, page) {      
          const userAuthToken = localStorage.getItem('userAuthToken');
          // Início função validar login
          const isValid = await validarToken(userAuthToken);
          if (!isValid) {
            app.views.main.router.navigate("/login/");
          } else {
            // Lógica para continuar usando o token
            app.views.main.router.navigate("/home/");
          }
            app.views.main.router.navigate("/home/");
        },
        pageAfterIn: function (event, page) {
          // fazer algo depois da página ser exibida
        },
        pageInit: function (event, page) {
          // fazer algo quando a página for inicializada
        },
        pageBeforeRemove: function (event, page) {
          // fazer algo antes da página ser removida do DOM
        },
      }
    },
    {
      path: '/home/',
      url: 'home.html',
      on: {
        pageBeforeIn: function (event, page) {
          // fazer algo antes da página ser exibida
          $("#menuPrincipal").show("fast");
          $("#menuPrincipal").removeClass("display-none");
          $("#navTop").removeClass("display-none");
        },
        pageAfterIn: function (event, page) {
          // fazer algo depois da página ser exibida
        },
        pageInit: function (event, page) {
          // fazer algo quando a página for inicializada
          // app.views.main.router.navigate('/carrinho/');
          var permissions = cordova.plugins.permissions;
          permissions.hasPermission(permissions.WRITE_EXTERNAL_STORAGE, checkPermissionCallback, null);

          function checkPermissionCallback(status) {
            if(!status.hasPermission) {
              var errorCallback = function() {
                console.log('Erro ao conceder permissoes');
              }

              permissions.requestPermission(
                permissions.WRITE_EXTERNAL_STORAGE,
                function(status) {
                  if(!status.hasPermission) errorCallback();
                },
                errorCallback);
            }
          }
          $.getScript('js/index.js');

          var swiper = new Swiper(".mySwiper", {
            slidesPerView: 1,
            spaceBetween: 30,
            autoplay: true,
            delay: 3000,
            loop: true,
            breakpoints: {
              50: {
                slidesPerView: 1,
                spaceBetween: 30
              },
              640: {
                slidesPerView: 2,
                spaceBetween: 30
              },
              992: {
                slidesPerView: 3,
                spaceBetween: 30
              },
              1200: {
                slidesPerView: 4,
                spaceBetween: 30
              },
            }
          });

          var swiper2 = new Swiper(".categorias", {
            slidesPerView: 3,
            spaceBetween: 10,
            breakpoints: {
              50: {
                slidesPerView: 3,
                spaceBetween: 10
              },
              640: {
                slidesPerView: 6,
                spaceBetween: 10
              },
              992: {
                slidesPerView: 8,
                spaceBetween: 10
              },
              1200: {
                slidesPerView: 12,
                spaceBetween: 10
              },
            }
          });

        },
        pageBeforeRemove: function (event, page) {
          // fazer algo antes da página ser removida do DOM
        },
      }
    },
    {
      path: "/tela-inicial/",
      url: "tela-inicial.html",
      animate: false,
      on: {
        pageBeforeIn: function (event, page) {
          // fazer algo antes da página ser exibida
          $("#navTop").hide("fast");
          $("#menuPrincipal").hide("fast");
        },
        pageAfterIn: function (event, page) {
          // fazer algo depois da página ser exibida
        },
        pageInit: function (event, page) {
          // fazer algo quando a página for inicializada
          var swiper = app.swiper.create(".swiper", {
            speed: 900,
            pagination: {
              el: ".swiper-pagination",
            },
            spaceBetween: 50,
          });

          //AÇÃO DO BOTÃO SIGNIN
          $("#signInSplash").on("click", function () {
            app.views.main.router.navigate("/login/");
          });
        },
        pageBeforeRemove: function (event, page) {
          // fazer algo antes da página ser removida do DOM
        },
      },
    },
    {
      path: "/login/",
      url: "login.html",
      animate: false,
      on: {
        pageBeforeIn: function (event, page) {
          // fazer algo antes da página ser exibida
        },
        pageAfterIn: function (event, page) {
          // fazer algo depois da página ser exibida
        },
        pageInit: function (event, page) {
          // fazer algo quando a página for inicializada

          //START AÇÃO BOTÃO ENTRAR
          $("#signIn").on("click", function () {
            app.dialog.preloader("Carregando...");
            //START OBTER VALORES DO LOGIN
            var userName = $("#userName").val();
            var userPassword = $("#userPassword").val();
            //END OBTER VALORES DO LOGIN

            if (userName == "" || userPassword == "") {
              app.dialog.close();
              app.dialog.alert(
                "Por favor, preencha seu Usuário e Senha.",
                '<i class="mdi mdi-alert"></i> Campos Vazios'
              );
            } else {
              // Cabeçalhos da requisição
              const headers = {
                "Content-Type": "application/json",
                "Authorization": appId,
              };

              const body = JSON.stringify({
                class: "ApplicationAuthenticationRestService",
                method: "getToken",
                login: userName,
                password: userPassword
              });

              // Opções da requisição
              const options = {
                method: "POST",
                headers: headers,
                body: body,
              };

              //START Fazendo a requisição
              fetch(apiServerUrl, options)
                .then((response) => response.json())
                .then((data) => {
                  if (data.data) {
                    const token = data.data;
                    localStorage.setItem('userAuthToken', token);
                    userAuthToken = token;
                    const decodedToken = jwt_decode(token);
                    // Navegar para outra página ou realizar outras ações necessárias

                    localStorage.setItem("user", decodedToken.user);
                    localStorage.setItem("userId", decodedToken.userid);
                    localStorage.setItem("userName", decodedToken.username);
                    localStorage.setItem("userEmail", decodedToken.usermail);
                    localStorage.setItem("validadeToken", decodedToken.expires);
                    localStorage.setItem("pessoaId", decodedToken.pessoa_id);
                    //localStorage.setItem("validadeToken", decodedToken.expires);

                    setTimeout(function () {
                      app.dialog.close();
                      app.views.main.router.navigate("/home/");
                    }, 300);

                  } else {
                    app.dialog.close();
                    app.dialog.alert("Erro no login: " + (data.message || "Dados inválidos"), "Falha no Login");
                  }
                })
                .catch((error) => {
                  app.dialog.close();
                  // Manipule os erros aqui
                  console.error("Erro:", error);
                });
              //END Fazendo a requisição
            }
          });
          //END AÇÃO BOTÃO ENTRAR

          //START BOTÃO RECUPERAR SENHA
          $("#forgotPassword").on("click", function () {
            app.dialog.prompt(
              "Informe o e-mail de login",
              "<b>SEU EMAIL DE LOGIN</b>",
              function (email) {
                localStorage.setItem("emailRecuperacao", email);

                app.dialog.preloader("Carregando...");

                const apiServerUrl = apiServer + "gerar_codigo.php";

                const headers = {
                  "Content-Type": "application/json",
                  "Authorization": "Bearer " + appId,
                };

                const body = JSON.stringify({
                  email: email,
                });

                const options = {
                  method: "POST",
                  headers: headers,
                  body: body,
                };

                fetch(apiServerUrl, options)
                  .then((response) => response.json())
                  .then((data) => {
                    app.dialog.close();
                    if (data.message == true) {
                      app.popup.open(".popup-recuperar-senha");
                      app.dialog.alert(
                        "Sucesso, um código foi enviado ao email informado.",
                        '<i class="mdi mdi-alert"></i> Código Enviado'
                      );
                    } else {
                      app.dialog.alert(data.message); // Exibe a mensagem da API
                    }
                  })
                  .catch((error) => {
                    console.error("Erro:", error);
                    app.dialog.close();
                    app.dialog.alert(
                      "Erro ao tentar recuperar a senha: " + error.message
                    );
                  });
              }
            );
          });
          //END BOTÃO RECUPERAR SENHA

          //START BOTÃO REDEFINIR SENHA PROXIMO PASSO
          $("#redefinirSenha").on("click", function () {
            var emailRecuperacao = localStorage.getItem("emailRecuperacao");
            var codigoRecebidoInserido = $("#codigoRecebido").val();

            const apiServerUrl = apiServer + "verificar_codigo.php";

            const headers = {
              "Content-Type": "application/json",
              "Authorization": "Bearer " + appId,
            };

            const body = JSON.stringify({
              email: emailRecuperacao,
              codigo: codigoRecebidoInserido,
            });

            const options = {
              method: "POST",
              headers: headers,
              body: body,
            };

            fetch(apiServerUrl, options)
              .then((response) => response.json())
              .then((data) => {
                app.dialog.close();
                if (data.message == true) {
                  localStorage.setItem("codigoRecuperacao", codigoRecebidoInserido);

                  app.popup.open(".popup-nova-senha");
                  app.popup.close(".popup-recuperar-senha");
                } else {
                  app.dialog.close();
                  app.dialog.alert(
                    "Erro, Código informado invalido ou expirado.",
                    '<i class="mdi mdi-alert"></i> Código Inválido'
                  );
                }
              })
              .catch((error) => {
                console.error("Erro:", error);
                app.dialog.close();
                app.dialog.alert(
                  "Erro, Código informado invalido ou expirado.",
                  '<i class="mdi mdi-alert"></i> Código Inválido'
                );
              });

          });
          //END BOTÃO REDEFINIR SENHA PROXIMO PASSO

          //START BOTÃO SALVAR SENHA
          $("#salvarSenha").on("click", function () {
            var emailRecuperacao = localStorage.getItem("emailRecuperacao");
            var codigoRecuperacao = localStorage.getItem("codigoRecuperacao");
            // Obtenha os valores dos campos de senha
            var novaSenha = $("#novaSenha").val();
            var reNovaSenha = $("#reNovaSenha").val();

            // Verifique se as senhas conferem
            if (novaSenha !== reNovaSenha) {
              app.dialog.alert('As senhas não conferem. Por favor, verifique.');
              return;
            }

            // Verifique se as senhas têm no mínimo 8 caracteres
            if (novaSenha.length < 8) {
              app.dialog.alert('A senha deve ter no mínimo 8 caracteres.');
              return;
            }

            const apiServerUrl = apiServer + "salvar_senha.php";

            const headers = {
              "Content-Type": "application/json",
              "Authorization": "Bearer " + appId,
            };

            const body = JSON.stringify({
              email: emailRecuperacao,
              codigo: codigoRecuperacao,
              senha: novaSenha,
            });

            const options = {
              method: "POST",
              headers: headers,
              body: body,
            };

            fetch(apiServerUrl, options)
              .then((response) => response.json())
              .then((data) => {
                app.dialog.close();
                if (data.message == true) {
                  app.popup.close(".popup-nova-senha");
                  app.dialog.alert(
                    "Sucesso, Senha alterada com sucesso, faça o Login.",
                    '<i class="mdi mdi-alert"></i> Sucesso'
                  );
                } else {
                  app.dialog.close();
                  app.dialog.alert(
                    "Erro, Código informado inválido ou expirado.",
                    '<i class="mdi mdi-alert"></i> Código Inválido'
                  );
                }
              })
              .catch((error) => {
                console.error("Erro:", error);
                app.dialog.close();
                app.dialog.alert(
                  "Erro, Código informado invalido ou expirado.",
                  '<i class="mdi mdi-alert"></i> Código Inválido'
                );
              });

          });
          localStorage.removeItem("emailRecuperacao");
          localStorage.removeItem("codigoRecuperacao");
          //END BOTÃO SALVAR SENHA

          //START AÇÃO BOTÃO REGISTER
          $("#register").on("click", function () {
            app.views.main.router.navigate("/registerView/");
          });
          //END AÇÃO BOTÃO REGISTER
        },
        pageBeforeRemove: function (event, page) {
          // fazer algo antes da página ser removida do DOM
        },
      },
    },
    {
      path: '/produtos/',
      url: 'produtos.html',
      animate: false,
      on: {
        pageBeforeIn: function (event, page) {
          // fazer algo antes da página ser exibida
        },
        pageAfterIn: function (event, page) {
          // fazer algo depois da página ser exibida
        },
        pageInit: function (event, page) {
          // fazer algo quando a página for inicializada
        },
        pageBeforeRemove: function (event, page) {
          // fazer algo antes da página ser removida do DOM
        },
      }
    },
    {
      path: '/clientes/',
      url: 'clientes.html',
      animate: false,
      on: {
        pageBeforeIn: function (event, page) {
          // fazer algo antes da página ser exibida
        },
        pageAfterIn: function (event, page) {
          // fazer algo depois da página ser exibida
        },
        pageInit: function (event, page) {
          // fazer algo quando a página for inicializada
          getClientes();
        },
        pageBeforeRemove: function (event, page) {
          // fazer algo antes da página ser removida do DOM
        },
      }
    },
    {
      path: '/vendas/',
      url: 'vendas.html',
      animate: false,
      on: {
        pageBeforeIn: function (event, page) {
          // fazer algo antes da página ser exibida
        },
        pageAfterIn: function (event, page) {
          // fazer algo depois da página ser exibida
        },
        pageInit: function (event, page) {
          // fazer algo quando a página for inicializada
        },
        pageBeforeRemove: function (event, page) {
          // fazer algo antes da página ser removida do DOM
        },
      }
    },
    {
      path: '/mais/',
      url: 'mais.html',
      animate: false,
      on: {
        pageBeforeIn: function (event, page) {
          // fazer algo antes da página ser exibida
        },
        pageAfterIn: function (event, page) {
          // fazer algo depois da página ser exibida
        },
        pageInit: function (event, page) {
          // fazer algo quando a página for inicializada
        },
        pageBeforeRemove: function (event, page) {
          // fazer algo antes da página ser removida do DOM
        },
      }
    },
    {
      path: '/detalhes/',
      url: 'detalhes.html',
      animate: false,
      on: {
        pageBeforeIn: function (event, page) {
          // fazer algo antes da página ser exibida
          $("#menuPrincipal").hide("fast");
        },
        pageAfterIn: function (event, page) {
          // fazer algo depois da página ser exibida
        },
        pageInit: function (event, page) {
          // fazer algo quando a página for inicializada
          $.getScript('js/detalhes.js');

          $('#shareButton').on('click', function() {
            // Defina o conteúdo HTML que você deseja converter em PDF
            let htmlContent = `
                
            <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; margin: 20px; }
                        h1 { color: #333; }
                        p { font-size: 14px; }
                        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                        th { background-color: #f2f2f2; }
                    </style>
                </head>
                <body>
                    <h1>Resumo do Pedido</h1>
                    <p>Detalhes do pedido...</p>
                    <table>
                        <thead>
                            <tr>
                                <th>Item</th>
                                <th>Quantidade</th>
                                <th>Preço</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Produto 1</td>
                                <td>2</td>
                                <td>R$ 50,00</td>
                            </tr>
                            <tr>
                                <td>Produto 2</td>
                                <td>1</td>
                                <td>R$ 30,00</td>
                            </tr>
                        </tbody>
                    </table>
                    <p>Total: R$ 130,00</p>
                </body>
            </html>
            `;
    
            // Opções para o PDF
            let options = {
                documentSize: 'A4',
                type: 'base64'
            };
    
            // Gera o PDF a partir do HTML
            pdf.fromData(htmlContent, options)
                .then(function(base64) {
                    // Salva o PDF no sistema de arquivos
                    let filePath = cordova.file.cacheDirectory + 'order-summary.pdf';
                    let pdfBlob = base64ToBlob(base64, 'application/pdf');
                    
                    window.resolveLocalFileSystemURL(cordova.file.cacheDirectory, function(dir) {
                        dir.getFile('order-summary.pdf', { create: true }, function(file) {
                            file.createWriter(function(fileWriter) {
                                fileWriter.write(pdfBlob);
    
                                fileWriter.onwriteend = function() {
                                    // Compartilha o PDF usando o plugin de compartilhamento
                                    window.plugins.socialsharing.share(null, 'Resumo do Pedido', filePath, null);
                                };
    
                                fileWriter.onerror = function(e) {
                                    console.error('Erro ao gravar o arquivo: ' + e.toString());
                                };
                            });
                        });
                    });
                })
                .catch(function(err) {
                    console.error('Erro ao gerar o PDF: ' + err.toString());
                });
        });
            // Função para converter base64 para Blob
    function base64ToBlob(base64, contentType) {
      const byteCharacters = atob(base64);
      const byteArrays = [];

      for (let offset = 0; offset < byteCharacters.length; offset += 512) {
          const slice = byteCharacters.slice(offset, offset + 512);
          const byteNumbers = new Array(slice.length);
          for (let i = 0; i < slice.length; i++) {
              byteNumbers[i] = slice.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          byteArrays.push(byteArray);
      }

      return new Blob(byteArrays, { type: contentType });
  }
        },
        pageBeforeRemove: function (event, page) {
          // fazer algo antes da página ser removida do DOM
        },
      }
    },
    {
      path: '/carrinho/',
      url: 'carrinho.html',
      options: {
        transition: 'f7-push',
      },
      on: {
        pageBeforeIn: function (event, page) {
          // fazer algo antes da página ser exibida
          $("#menuPrincipal").hide("fast");
        },
        pageAfterIn: function (event, page) {
          // fazer algo depois da página ser exibida
        },
        pageInit: function (event, page) {
          // fazer algo quando a página for inicializada         
          $.getScript('js/carrinho.js');
        },
        pageBeforeRemove: function (event, page) {
          // fazer algo antes da página ser removida do DOM
        },
      }
    },
  ],
  // ... other parameters
  view: {
    animate: false, // Disable animations for view transitions
    iosDynamicNavbar: false, // Disable dynamic navbar animations for iOS
    stackPages: true, // To prevent reloading pages, useful if still facing issues
  },
});

//Para testes direto no navegador
//var mainView = app.views.create('.view-main', { url: '/index/' });

//EVENTO PARA SABER O ITEM DO MENU ATUAL
app.on('routeChange', function (route) {
  var currentRoute = route.url;
  console.log(currentRoute);
  document.querySelectorAll('.tab-link').forEach(function (el) {
    el.classList.remove('active');
  });
  var targetEl = document.querySelector('.tab-link[href="' + currentRoute + '"]');
  if (targetEl) {
    targetEl.classList.add('active');
  }
});

document.addEventListener('deviceready', setTimeout(SetStatusBarColor, 500), false);
function SetStatusBarColor() {
  StatusBar.overlaysWebView(false);

  StatusBar.backgroundColorByHexString("#8D51FF");

  // Set the status bar text color to black

  StatusBar.styleDefault();
  NavigationBar.backgroundColorByHexString("#FFFFFF", true);

}


function onDeviceReady() {
  //Quando estiver rodando no celular
  var mainView = app.views.create('.view-main', { url: '/index/' });

  //COMANDO PARA "OUVIR" O BOTAO VOLTAR NATIVO DO ANDROID 	
  document.addEventListener("backbutton", function (e) {

    if (mainView.router.currentRoute.path === '/index/') {
      e.preventDefault();
      app.dialog.confirm('Deseja sair do aplicativo?', function () {
        navigator.app.exitApp();
      });
    } else {
      e.preventDefault();
      mainView.router.back({ force: true });
    }
  }, false);

}

// Bloquear o menu de contexto no clique com o botão direito
document.addEventListener('contextmenu', function (event) {
  event.preventDefault();
});
// Bloquear o menu de em imagens e links
document.querySelectorAll('img, a').forEach(function (element) {
  element.addEventListener('contextmenu', function (event) {
    event.preventDefault();
  });
});
//Fim dos bloqueios do menu contexto
