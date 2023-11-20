const bcryptjs = require("bcryptjs");
const nodemailer = require("nodemailer");
const { render } = require("ejs");
const session = require("express-session");
const express = require("express");
const moment = require("moment");
const { text } = require("express");
const controller = {};

// webs push
let pushSubscripton;

controller.subscription = async (req, res) => {
  pushSubscripton = req.body;
  console.log(pushSubscripton);

  // Server's Response
  res.status(201).json();
};

controller.newmessage = async (req, res) => {
  const { message } = req.body;
  // Payload Notification
  const payload = JSON.stringify({
    title: "My Custom Notification",
    message
  });
  res.status(200).json();
  try {
    await webpush.sendNotification(pushSubscripton, payload);
  } catch (error) {
    console.log(error);
  }
};


//SELECT SUM(cantidad) AS total FROM consumibles WHERE id_consumibles = 'GUL02';
//SELECT * FROM logs_inventario_consumibles WHERE id=(SELECT max(id) FROM logs_inventario_consumibles WHERE id_consumibles = 'GUL70');
//SELECT SUM(cantidad_nueva_ingresada) FROM logs_inventario_consumibles WHERE id_consumibles = 'GUL70';
//SELECT fecha FROM logs_inventario_consumibles WHERE id=(SELECT max(id) FROM logs_inventario_consumibles WHERE id_consumibles = 'GUL70');
controller.inicialPage = (req, res) => {
  res.render("index");
};
controller.inicialPageContact = (req, res) => {
  res.render("contact");
};
controller.logAut = (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
};
//vistas login
controller.login = (req, res) => {
  if (req.session.loggedin) {
    res.redirect("/home");
  } else {
    res.render("login")
  }

};
controller.loginAuth = async (req, res) => {
  const user = req.body.user;
  const pass = req.body.pass;
  let passwordHaash = await bcryptjs.hash(pass, 8);
  if (user && pass) {
    req.getConnection((error, conn) => {
      conn.query(
        "SELECT * FROM usuarios WHERE user=?",
        [user],
        async (error, results) => {
          if (
            results.length === 0 ||
            !(await bcryptjs.compare(pass, results[0].password))
          ) {
            res.render("login", {
              alert: true,
              alertTitle: "Ups los datos no coinciden",
              alertMessage:
                "por favor revise correctamente la información y si este error continua vuelve a intentarlo mas tarde",
              alertIcon: "error",
              showConfirmButton: true,
              ruta: "login",
              timer: 10000,
            });
          } else {
            req.session.loggedin = true;
            req.session.name = results[0].nombre;
            req.session.role = results[0].cargo;
            req.session.dependency = results[0].dependencia;
            req.session.ID = results[0].id;
            req.session.activo = results[0].registro_ingreso;
            res.render("login", {
              alert: true,
              alertTitle: "acceso concedido",
              alertMessage: "acceso valido",
              alertIcon: "success",
              showConfirmButton: false,
              ruta: "home",
              timer: 3000,
            });
          }
        }
      );
    });
  } else {
    res.render("login", {
      alert: true,
      alertTitle: "Ups por favor llene todos los datos",
      alertMessage:
        "por favor revise correctamente la información y si este error continua vuelve a intentarlo mas tarde",
      alertIcon: "error",
      showConfirmButton: true,
      ruta: "login",
      timer: 10000,
    });
  }
};
//home y welcome
controller.welcome = (req, res) => {
  if (req.session.loggedin) {
    res.render("welcome", {
      login: true,
      name: req.session.name,
      role: req.session.role,
    });
  } else {
    res.render("login", {
      login: false,
    });
  }
};

controller.home = (req, res) => {
  if (req.session.loggedin) {
    id_usuario = req.session.ID
    if (req.session.role === "admin" || req.session.role == 'supervisor') {
      req.getConnection((error, conn) => {
        conn.query("SELECT  YEAR(fecha_registro) AS ano,  MONTH(fecha_registro) AS mes, SUM(CantidadMO) AS total_kilos  FROM registrodiarioestadooperacion GROUP BY  ano, mes  ORDER BY ano, mes;", (error, chartData) => {
          if (error) {
            console.log(error)
          } else {
            req.getConnection((error, conn) => {
              conn.query("SELECT  YEAR(fecha_registro) AS ano,  MONTH(fecha_registro) AS mes, SUM(cantidadCompost) AS total_kilos  FROM registrodiarioestadooperacion GROUP BY  ano, mes  ORDER BY ano, mes;", (error, chartData1) => {
                if (error) {
                  console.log(error)
                } else {
                  req.getConnection((error, conn) => {
                    conn.query("SELECT YEAR(fecha_registro) as ano, MONTH(fecha_registro) as mes, temperatura FROM registrodiarioestadooperacion WHERE temperatura IS NOT NULL ORDER BY YEAR(fecha_registro) ASC, MONTH(fecha_registro) ASC;", (error, chartData2) => {
                      if (error) {
                        console.log(error)
                      } else {
                        req.getConnection((error, conn) => {
                          conn.query("SELECT YEAR(fecha_registro) as ano, MONTH(fecha_registro) as mes, humedad FROM registrodiarioestadooperacion   WHERE humedad IS NOT NULL ORDER BY YEAR(fecha_registro) ASC, MONTH(fecha_registro) ASC;", (error, chartData3) => {
                            if (error) {
                              console.log(error)
                            } else {
                              req.getConnection((error, conn) => {
                                conn.query("SELECT * FROM `registrodiarioestadooperacion` ORDER BY `registrodiarioestadooperacion`.`id` DESC LIMIT 5", (error, ultimosRegistros) => {
                                  if (error) {
                                    console.log(error)
                                  } else {
                                    req.getConnection((error, conn) => {
                                      conn.query("SELECT localidad_compostera, COUNT(*) AS cantidad_de_registros FROM composteras GROUP BY localidad_compostera;", (error, ctnporlocalidad) => {
                                        if (error) {
                                          console.log(error)
                                        } else {
                                          req.getConnection((error, conn) => {
                                            conn.query("SELECT * FROM composteras", (error, results) => {
                                              if (error) {
                                                console.log(error);
                                              } else {
                                                req.getConnection((error, conn) => {
                                                  conn.query("SELECT COUNT(*) AS total_composteras FROM composteras;", (error, cntComposteras) => {
                                                    if (error) {
                                                      console.log(error);
                                                    } else {
                                                      req.getConnection((error, conn) => {
                                                        conn.query("SELECT COUNT(*) AS composteras_en_operacion FROM composteras WHERE estado = 'COMPLETADO';", (error, cntComposEnoperacion) => {
                                                          if (error) {
                                                            console.log(error);
                                                          } else {
                                                            req.getConnection((error, conn) => {
                                                              conn.query("SELECT  SUM(CantidadME) + SUM(CantidadMO) AS sumaTotal FROM registrodiarioestadooperacion", (error, BiomasaCargada) => {
                                                                if (error) {
                                                                  console.log(error);
                                                                } else {
                                                                  req.getConnection((error, conn) => {
                                                                    conn.query("SELECT  SUM(cantidadCompost) AS sumaTotal FROM registrodiarioestadooperacion WHERE TipoRegistro = 'COMPOSTMADURADO';", (error, compostDescargado) => {
                                                                      if (error) {
                                                                        console.log(error);
                                                                      } else {
                                                                        const datacasa = false;
                                                                        res.render("home", {
                                                                          chartData: JSON.stringify(chartData),
                                                                          chartData1: JSON.stringify(chartData1),
                                                                          chartData2: JSON.stringify(chartData2),
                                                                          chartData3: JSON.stringify(chartData3),
                                                                          ctnporlocalidad: JSON.stringify(ctnporlocalidad),
                                                                          dischartData2: chartData2,
                                                                          ultimosRegistros: ultimosRegistros,
                                                                          coordenadas: results,
                                                                          cntComposteras: cntComposteras,
                                                                          cntComposEnoperacion: cntComposEnoperacion,
                                                                          BiomasaCargada: BiomasaCargada,
                                                                          compostDescargado: compostDescargado,
                                                                          login: true,
                                                                          name: req.session.name,
                                                                          role: req.session.role,
                                                                          id: req.session.ID,
                                                                        });
                                                                      }
                                                                    })
                                                                  })
                                                                }
                                                              })
                                                            })
                                                          }
                                                        })
                                                      })
                                                    }
                                                  })
                                                })
                                              }
                                            })
                                          })
                                        }
                                      })

                                    })

                                  }
                                })

                              })

                            }
                          })

                        })

                      }
                    })

                  })

                }
              })

            })

          }
        })

      })

    } else if (req.session.role === "user1") {
      req.getConnection((error, conn) => {
        conn.query("SELECT * FROM composteras WHERE id_usuario=?", [id_usuario], (error, results) => {
          if (error) {
            console.log(error);
          } else {
            var idCompost = results[0].id
            const datacasa = false;
            res.render("userhome", {
              results: results,
              login: true,
              name: req.session.name,
              role: req.session.role,
              id: req.session.ID,
            });
          }
        })
      })

    }


  } else {
    res.render("login", {
      login: false,
    });
  }
};
controller.vistamapacomposteras = (req, res) => {
  if (req.session.loggedin) {
    req.getConnection((error, conn) => {
      conn.query("SELECT * FROM composteras", (error, results) => {
        if (error) {
          console.log(error);
        } else {
          const datacasa = false;
          res.render("mapacompost", {
            login: true,
            name: req.session.name,
            role: req.session.role,
            id: req.session.ID,
            coordenadas: results,
            datacasa: datacasa
          });
        }
      })
    })

  } else {
    res.render("login", {
      login: false,
    });
  }
};

controller.buscarcasamapa = (req, res) => {
  if (req.session.loggedin) {
    const numcasa = req.body.numcasa;
    req.getConnection((error, conn) => {
      conn.query("SELECT * FROM composteras WHERE	id=?", [numcasa], (error, results) => {
        if (error) {
          console.log(error);
        } else {
          console.log(results);
          if (results.length != 0) {
            const datacasa = true;
            res.render("mapacompost", {
              login: true,
              name: req.session.name,
              role: req.session.role,
              id: req.session.ID,
              coordenadas: results,
              datacasa: datacasa
            });
          } else {
            res.render("notification", {
              alert: true,
              alertTitle: "No existe",
              alertMessage: "Este casa no esta registrada",
              alertIcon: "success",
              showConfirmButton: false,
              ruta: "vistamapacmc",
              timer: 3000,
            });
          }

        }
      })
    })

  } else {
    res.render("login", {
      login: false,
    });
  }
};






//panel Gestion documental
controller.panelGestionDocuemntal = (req, res) => {
  if (req.session.loggedin) {
    res.render("panelGestionDocuemntal", {
      login: true,
      name: req.session.name,
      role: req.session.role,
    });
  } else {
    res.render("login", {
      login: false,
    });
  }
};


controller.panelSSG = (req, res) => {
  if (req.session.loggedin) {
    res.render("panelSSG", {
      login: true,
      name: req.session.name,
      role: req.session.role,
    });
  } else {
    res.render("login", {
      login: false,
    });
  }
};












//vistas register
controller.register = (req, res) => {
  if (req.session.loggedin) {
    if (req.session.role == "admin") {
      req.getConnection((error, conn) => {
        conn.query("SELECT * FROM usuarios", (error, results) => {
          if (error) {
            console.log(error);
          } else {
            res.render("registerTable", {
              results: results,
              login: true,
              name: req.session.name,
              role: req.session.role,
            });
          }
        });
      });
    } else {
      res.render("home", {
        login: true,
        name: req.session.name,
        role: req.session.role,
      });
    }
  } else {
    res.render("login", {
      login: false,
    });
  }
};

controller.registerUsers = (req, res) => {
  if (req.session.loggedin) {
    if (req.session.role == "admin") {
      res.render("registerUser", {
        login: true,
        name: req.session.name,
        role: req.session.role,
      });
    } else {
      res.render("login", {
        login: false,
      });
    }
  } else {
    res.render("login", {
      login: false,
    });
  }
};

//apis register
//envio register
controller.sendRegister = async (req, res) => {
  const nombre = req.body.nombre;
  const email = req.body.email;
  const user = req.body.user;
  const pass = req.body.password;
  const rol = req.body.role;
  const dependencia = req.body.dependencia;
  let passwordHaash = await bcryptjs.hash(pass, 8);
  req.getConnection((error, conn) => {
    conn.query(
      "INSERT INTO usuarios SET ?",
      {
        nombre: nombre,
        email: email,
        user: user,
        password: passwordHaash,
        cargo: rol,
        dependencia: dependencia,
      },
      async (error, results) => {
        if (error) {
          console.log(error);
          res.render("registerUser", {
            alert: true,
            alertTitle: "Ups hubo algun problema",
            alertMessage:
              "por favor revise correctamente la informacion y si este error continua vuelve a intentarlo mas tarde ten en cuenta que si el usuario ya esta creado no lo podras agregar",
            alertIcon: "error",
            showConfirmButton: true,
            ruta: "usuario",
            timer: 15000,
          });
        } else {

          res.render("registerUser", {

            alert: true,
            alertTitle: "Registrado",
            alertMessage: "Registro de cuenta Exitosa",
            alertIcon: "success",
            showConfirmButton: true,
            ruta: "register",
            timer: 15000,
          });
        }
      }
    );
  });
};

controller.registerUEdit = (req, res) => {
  if (req.session.loggedin) {
    if (req.session.role == "admin") {
      const id = req.params.id;
      req.getConnection((error, conn) => {
        conn.query(
          "SELECT * FROM usuarios WHERE id = ?",
          [id],
          (error, results) => {
            if (error) {
              console.log(error);
            } else {
              res.render("editUsers", {
                user: results[0],
                login: true,
                name: req.session.name,
                role: req.session.role,
              });
            }
          }
        );
      });
    } else {
      res.render("login", {
        login: false,
      });
    }
  } else {
    res.redirect("/login");
  }
};
controller.sendUpdateUser = (req, res) => {
  if (req.session.loggedin) {
    if (req.session.role == "admin") {
      const id = req.body.id;
      const name = req.body.nombre;
      const user = req.body.user;
      const email = req.body.email;
      const role = req.body.cargo;
      const password = req.body.cargo;
      req.getConnection((error, conn) => {
        conn.query(
          "UPDATE usuarios SET ? WHERE id = ?",
          [{ nombre: name, user: user, email: email, cargo: role }, id],
          (error, results) => {
            if (error) {
              console.log(error);
            } else {
              res.redirect("/register");
            }
          }
        );
      });
    } else {
      res.redirect("/home");
    }
  } else {
    res.redirect("/login");
  }
};
controller.deleteUser = (req, res) => {
  if (req.session.loggedin) {
    if (req.session.role == "admin") {
      const id = req.params.id;
      req.getConnection((error, conn) => {
        conn.query(
          "DELETE FROM usuarios WHERE id= ?",
          [id],
          (error, results) => {
            if (error) {
              console.log(error);
            } else {
              res.redirect("/register");
            }
          }
        );
      });
    }
  }
};

controller.perfilUsuario = (req, res) => {
  if (req.session.loggedin) {
    const id_user = req.params.id;
    req.getConnection((error, conn) => {
      conn.query("SELECT * FROM usuarios WHERE id = ?", [id_user], (error, resultado) => {
        console.log(resultado);

        res.render("perfilUsuarioPanel", {

          resultado: resultado,
          login: true,
          name: req.session.name,
          role: req.session.role,
        });
      })
    })

  } else {
    res.render("login", {
      login: false,
    });
  }
};


controller.perfilCompost = (req, res) => {
  if (req.session.loggedin) {
    const idCompost = req.params.id;
    req.getConnection((error, conn) => {
      conn.query("SELECT * FROM composteras WHERE id=?", [idCompost], (error, results) => {
        if (error) {
          console.log(error);
        } else {
          console.log(results[0].id_usuario)
          const idresponsable = results[0].id_usuario;
          req.getConnection((error, conn) => {
            conn.query("SELECT * FROM usuarios WHERE id = ?", [idresponsable], (error, userdata) => {
              if (error) {
                console.log(error)
              } else {
                req.getConnection((error, conn) => {
                  conn.query("SELECT * FROM registrodiarioestadooperacion WHERE id_compostera=?", [idCompost], (error, resTotalRegistros) => {
                    if (error) {
                      console.log(error);
                    } else {
                      req.getConnection((error, conn) => {
                        conn.query("SELECT  YEAR(fecha_registro) AS ano,  MONTH(fecha_registro) AS mes, SUM(CantidadMO) AS total_kilos  FROM registrodiarioestadooperacion WHERE id_compostera = ? GROUP BY  ano, mes  ORDER BY ano, mes;", [idCompost], (error, chartData) => {
                          if (error) {
                            console.log(error)
                          } else {
                            req.getConnection((error, conn) => {
                              conn.query("SELECT  YEAR(fecha_registro) AS ano,  MONTH(fecha_registro) AS mes, SUM(cantidadCompost) AS total_kilos  FROM registrodiarioestadooperacion WHERE id_compostera = ? GROUP BY  ano, mes  ORDER BY ano, mes;", [idCompost], (error, chartData1) => {
                                if (error) {
                                  console.log(error)
                                } else {
                                  req.getConnection((error, conn) => {
                                    conn.query("SELECT YEAR(fecha_registro) as ano, MONTH(fecha_registro) as mes, temperatura FROM registrodiarioestadooperacion WHERE temperatura AND id_compostera = ? IS NOT NULL ORDER BY YEAR(fecha_registro) ASC, MONTH(fecha_registro) ASC;", [idCompost], (error, chartData2) => {
                                      if (error) {
                                        console.log(error)
                                      } else {
                                        req.getConnection((error, conn) => {
                                          conn.query("SELECT YEAR(fecha_registro) as ano, MONTH(fecha_registro) as mes, humedad FROM registrodiarioestadooperacion WHERE humedad AND id_compostera = ? IS NOT NULL ORDER BY YEAR(fecha_registro) ASC, MONTH(fecha_registro) ASC;", [idCompost], (error, chartData3) => {
                                            if (error) {
                                              console.log(error)
                                            } else {
                                              const datacasa = false;
                                              res.render("perfilCompostera", {
                                                results: results,
                                                chartData: JSON.stringify(chartData),
                                                chartData1: JSON.stringify(chartData1),
                                                chartData2: JSON.stringify(chartData2),
                                                chartData3: JSON.stringify(chartData3),
                                                dischartData2: chartData2,
                                                userdata: userdata,
                                                resTotalRegistros: resTotalRegistros,
                                                login: true,
                                                name: req.session.name,
                                                role: req.session.role,
                                                id: req.session.ID,
                                              });

                                            }
                                          })

                                        })

                                      }
                                    })

                                  })

                                }
                              })

                            })

                          }
                        })

                      })


                    }
                  })
                })


              }
            })

          })

        }
      })
    })
  } else {
    res.render("login", {
      login: false,
    });
  }
};
controller.myperfil = (req, res) => {
  if (req.session.loggedin) {
    const id_user = req.session.ID;
    req.getConnection((error, conn) => {
      conn.query("SELECT * FROM usuarios WHERE id = ?", [id_user],
        (error, resultado) => {
          if (error) {
            console.log(error);
          } else {
            req.getConnection((error, conn) => {
              conn.query("SELECT * FROM asistencia_dias WHERE id_usuario = ?", [id_user],
                (error, resultado_asistencia) => {
                  if (error) {
                    console.log(error);
                  } else {
                    req.getConnection((error, conn) => {
                      conn.query("SELECT SUM(horas_total) AS horas_total FROM asistencia_dias WHERE id_usuario = ?", [id_user],
                        (error, resultado_HorTotales) => {
                          if (error) {
                            console.log(error);
                          } else {
                            var horasmestrabajadas = resultado_HorTotales[0].horas_total
                            var salarioactual = resultado[0].salarioMes
                            var salariodia = salarioactual / 30
                            var salariohora = salariodia.toFixed(1) / 24

                            var salarioTotalPesos = salariohora * horasmestrabajadas
                            var salariopesos = salarioTotalPesos.toFixed(2)

                            console.log(salarioactual)
                            console.log(salariodia)
                            console.log(salariohora)
                            console.log(salariopesos)
                            console.log(resultado_HorTotales)

                            res.render("perfilUsuarioPanel", {
                              resultado_asistencia: resultado_asistencia,
                              salarioTotalPesos: salariopesos,
                              horasmestrabajadas: horasmestrabajadas,
                              resultado: resultado,
                              login: true,
                              name: req.session.name,
                              role: req.session.role,
                            });

                          }

                        })
                    })

                  }

                })
            })

          }

        })
    })

  } else {
    res.render("login", {
      login: false,
    });
  }
};

controller.actualizarFotoPerfilSend = (req, res) => {
  if (req.session.loggedin) {
    let id = req.session.ID;
    let foto = req.file.filename;

    req.getConnection((error, conn) => {
      conn.query(
        "UPDATE usuarios SET ? WHERE id = ? ",
        [
          {
            foto_perfil: foto,
          },
          id,
        ],
        (error, results) => {
          if (error) {
            console.log(error);
          } else {
            console.log(results);
            res.redirect("/myperfil");

            // res.render("cronogramaConplit3", {
            //   id:id,
            //   fecha:fecha,
            //   hora:hora,
            //   nombre_archivo:nombre_archivo,
            //   login: true,
            //   name: req.session.name,
            //   role: req.session.role,
            //   id_user: req.session.id
            // });
          }
        }
      );
    });
  } else {
    res.redirect("/login")
  }

};

//cambio de contraseña
controller.passwordNew = (req, res) => {
  if (req.session.loggedin) {
    if (req.session.role == "admin") {
      const id = req.params.id;
      req.getConnection((error, conn) => {
        conn.query(
          "SELECT * FROM usuarios WHERE id = ?",
          [id],
          (error, results) => {
            if (error) {
              console.log(error);
            } else {
              res.render("newPassword", { user: results[0] });
            }
          }
        );
      });
    } else {
      res.redirect("/home");
    }
  } else {
    res.redirect("/login");
  }
};
controller.savePasssword = async (req, res) => {
  if (req.session.loggedin) {
    if (req.session.role == "admin") {
      const id = req.body.id;
      const pass = req.body.password;
      let passwordHaash = await bcryptjs.hash(pass, 8);
      req.getConnection((error, conn) => {
        conn.query(
          "UPDATE usuarios SET ? WHERE id = ?",
          [{ password: passwordHaash }, id],
          async (error, results) => {
            if (error) {
              console.log(error);
            } else {
              res.redirect("/register");
            }
          }
        );
      });
    }
  }
};




// envio de correos
controller.sendCorreEQ1 = async (req, res) => {
  const correo = req.body.correo;
  const name = req.body.nombre;
  const name_equipo = req.body.nombre_equipo;
  const codigoEQ = req.body.codigo_equipo;
  var transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: "maisanmailer@gmail.com",
      pass: "231215maisanmailer",
    },
  });
  var mailOptions = {
    from: "Remitente",
    to: correo,
    subject: "Por favor debuelva el equipo de seguridad ",
    html:
      `<!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="utf-8">
            <title>holi</title>
        </head>
        <body style="background-color: white ">
        
        <!--Copia desde aquí-->
        <table style="max-width: 600px; padding: 10px; margin:0 auto; border-collapse: collapse;">
            <tr>
            <td style="background-color: #ecf0f1; text-align: left; padding: 0; display: inline-block; ">
            <div style="display: inline-block;" >
                <a href="https://redline.net.co/" >
                    <img width="20%" style="display:inline-block; margin: 1.5% 3%" src="https://redline.net.co/wp-content/uploads/2020/01/cropped-LOGOREDLINE-2.png">
                </a>
                <a href="https://github.com/flipgamership" >
                    <img width="10%" style="display:inline-block; margin: 2% 3%" src="https://lh3.googleusercontent.com/Qm964MvlThDWpO2G8sD2B339Z3Y1WPUuddC4dJpWjwhlrleLdxVmRypBTLxuXOtWofe6lopRd4r1BiBf_bHf1ZBweMLrBaP-jiHwWEulIRre_47CRDS4Anx2-JX0NMZLMLsNK5EO6Ztfd9ywb1ZsGYtF_oCFrZAikAUH3hj8OXD2V4jwFE4HZwj-m4NgDN7kYgSrSGH7M4TjaXuvmLcHAETa_x8kkBR7P8A2i3UQbBNVVGJeLN9mEOqWKcw2dGatg19-9CD-FNRaTBYi8sLLKybKP2ptpXnCfIbs2n1IW2LAEthVuZP-I3hlbpVw4LgJjXvxVvsgPn09DdotCahjMcGeuDjHJC7ZQFxRJZyvPM5g4ZOKGV8GzolzQdUFXuGFOyFqMpNAxQjcKdofi-J1RALPD9FAn4qRP47LNPdreMCwFwWITFDRGtrLO6qnPUPNjFjGFFGklVTcw67qtvw1WWLG7yeUjipm2j1wlTwz6v3zy3EXLLfzNWEOW9QkQ-wIOQe1C5-wbZ6Yt4eaCkIz0P4zLB58fkMt_2SNJJ6rRyfqvor58owEAxobsOlo8txPNE-Ck3_cVoCMpizPbSC57xe1rOEqrHE8C-M6CwT4RKlXBCIoxV32SHRD40hkVvmiELJIOW-F72zNow2vYtNAjnmYCxz6kglFZY70iR5OaBkzPtNqYnu9s-iKHqtdM2swmAdi63TXdBfrZ8LT4ghQAks=w603-h438-no?authuser=0">
                </a>
            </div>
            
        </td>
            </tr>
        
            <tr>
                <td style="padding: 0">
                    <img style="padding: 0; display: block" src="https://p4.wallpaperbetter.com/wallpaper/335/895/657/wind-farm-wallpaper-preview.jpg" width="100%">
                </td>
            </tr>
            
            <tr>
                <td style="background-color: #ecf0f1">
                    <div style="color: #34495e; margin: 4% 10% 2%; text-align: justify;font-family: sans-serif">
                        <h2 style="color: #e67e22; margin: 0 0 7px">Hola tecnico de Redline!</h2>
                        <p style="margin: 2px; font-size: 15px">
                            espero que este teniendo un hermoso dia somos el servicio de notificaciones a 
                            correo del sistema de inventario de redline el dia de hoy te escirbimos para solicitar la debolucion de :</p>
                        <ul style="font-size: 15px;  margin: 10px 0">
                            <li>Equipo de seguridad: </li>
                            <p style="color: #eebbf8; margin-top: 3px; margin-left: 2px; text-align: center;">
                            ` +
      name_equipo +
      `
                            </p>
                            
                            <li>Codigo del equipo de seguridad: </li>
                            <p style="color: #eebbf8; margin-top: 3px; margin-left: 2px; text-align: center;">
                            ` +
      codigoEQ +
      `
                            </p>
                            
                            <li>¿Quien me tiene?</li>
                            <p style="color: #eebbf8; margin-top: 3px; margin-left: 2px; text-align: center;">
                            ` +
      name +
      `
                            </p>
                            
      
      
                            <li>Espero que la devuelvas a la bodega y el ingreso en la plataforma</li>
                        </ul>
                        <p style="color: #b3b3b3; font-size: 12px; text-align: center;margin: 30px 0 0">redline || <a href="https://github.com/flipgamership">Juan Felipe Correa Rios</a></p>
                    </div>
                </td>
            </tr>
        </table>
        <!--hasta aquí-->
        
        </body>
        </html>
        
        `,
  };
  const info = await transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("mail enviado");
      res.redirect("/inventoriTableEquipoSeguridadPrestadoRedline");
    }
  });
};



// logs




//sistema de conograma para el uso interno de la empresa

//sona de pruebas


controller.cronogramaBuscarTel = (req, res) => {
  if (req.session.loggedin) {
    const BuscarTel = req.body.BuscarTel;

    if (req.session.role == "user1" || req.session.role == "admin" || req.session.role == "supervisor" || req.session.role == "Despachador") {
      req.getConnection((error, conn) => {
        conn.query(
          "SELECT * FROM cronogramas  WHERE celular = ?  ORDER BY cronogramas.fecha DESC", [BuscarTel], (error, results) => {
            if (error) {
              console.log(error);
            } else {
              console.log(req.session.id);

              res.render("cronograma_menu_servicio_c", {
                total: false,
                results: results,
                login: true,
                name: req.session.name,
                role: req.session.role,
                id_user: req.session.ID,
              });
            }
          }
        );
      });
    }
  } else {
    res.redirect("/login");
  }
};

controller.totalcomposterashoy = (req, res) => {
  if (req.session.loggedin) {
    var fecha = new Date(); //Fecha actual
    var mes = fecha.getMonth() + 1; //obteniendo mes
    var dia = fecha.getDate();
    var ano = fecha.getFullYear(); //obteniendo año
    if (dia < 10) dia = "0" + dia; //agrega cero si el menor de 10
    if (mes < 10) mes = "0" + mes; //agrega cero si el menor de 10
    var value = ano + "-" + mes + "-" + dia;
    var fechaACTUAL = String(value);
    console.log(fechaACTUAL);

    if (req.session.role == "user1") {
      req.getConnection((error, conn) => {
        conn.query(
          "SELECT DISTINCT  FROM composteras  WHERE fecha = ? || estado = 'INCOMPLETO' && fecha <= ? ORDER BY cronogramas.fecha DESC",
          [fechaACTUAL, fechaACTUAL],
          (error, results) => {
            if (error) {
              console.log(error);
            } else {
              req.getConnection((error, conn) => {
                conn.query("SELECT DISTINCT (fecha) FROM cronogramas ORDER BY cronogramas.fecha DESC LIMIT 10", (error, resultado) => {
                  if (error) {
                    console.log(error);
                  } else {
                    console.log(resultado);

                    res.render("cronograma_menu_servicio_c", {
                      total: false,
                      results: results,
                      resultado: resultado,
                      login: true,
                      name: req.session.name,
                      role: req.session.role,
                      id_user: req.session.ID,
                    });
                  }
                })
              });
            }
          }
        );
      });
    } else if (
      req.session.role == "admin" ||
      req.session.role == "supervisor" ||
      req.session.role == "Despachador"
    ) {
      req.getConnection((error, conn) => {
        conn.query(
          "SELECT * FROM cronogramas  WHERE fecha = ? || estado = 'INCOMPLETO' && fecha <= ? ORDER BY cronogramas.fecha DESC ",
          [fechaACTUAL, fechaACTUAL],
          (error, results) => {
            if (error) {
              console.log(error);
            } else {
              req.getConnection((error, conn) => {
                conn.query("SELECT DISTINCT (fecha) FROM cronogramas WHERE fecha = ? ORDER BY cronogramas.fecha DESC LIMIT 10 ", [fechaACTUAL], (error, resultado) => {
                  if (error) {
                    console.log(error);
                  } else {
                    console.log(resultado);


                    res.render("cronograma_menu_servicio_c", {
                      total: false,
                      results: results,
                      resultado: resultado,
                      login: true,
                      name: req.session.name,
                      role: req.session.role,
                      id_user: req.session.ID,
                    });
                  }
                })
              });
            }
          }
        );
      });
    }
  } else {
    res.redirect("/login");
  }
};

controller.cronogramaTodo = (req, res) => {
  if (req.session.loggedin) {
    req.getConnection((error, conn) => {
      conn.query(
        "SELECT * FROM cronogramas   WHERE estado = 'INCOMPLETO' || estado = 'REPROGRAMAR' ",
        (error, results) => {
          if (error) {
            console.log(error);
          } else {
            req.getConnection((error, conn) => {
              conn.query("SELECT DISTINCT (fecha) FROM cronogramas ORDER BY cronogramas.fecha DESC LIMIT 10", (error, resultado) => {
                if (error) {
                  console.log(error);
                } else {
                  res.render("cronograma_menu_servicio_c", {
                    total: false,
                    results: results,
                    resultado: resultado,
                    login: true,
                    name: req.session.name,
                    role: req.session.role,
                    id_user: req.session.ID,
                  });
                }
              })
            });
          }
        }
      );
    });
  } else {
    res.redirect("/login");
  }
};

controller.composteraNew = (req, res) => {
  if (req.session.loggedin) {
    req.getConnection((error, conn) => {
      conn.query(
        "SELECT id, nombre, cargo FROM usuarios ",
        (error, results) => {
          if (error) {
            console.log(error);
          } else {
            console.log(results);
            res.render("newCompostera", {
              results: results,
              login: true,
              ID: req.session.ID,
              name: req.session.name,
              role: req.session.role,
            });
          }
        }
      );
    });
  } else {
    res.redirect("/login");
  }
};
controller.checkcodBenefic = (req, res) => {
  if (req.session.loggedin) {
    const codBenefic = req.query.codBenefic;
    const sql = 'SELECT COUNT(*) AS userCount FROM composteras WHERE codBenefic = ?';
    req.getConnection((error, conn) => {
      conn.query(sql, [codBenefic], (error, results) => {
        if (error) {
          console.error(err);
          res.status(500).json({ exists: false });
          return;
        } else {
          const userCount = results[0].userCount;
          res.json({ exists: userCount > 0 });
        }
      }
      );
    });
  } else {
    res.redirect("/login");
  }
};






controller.formVisitaSeguimiento = (req, res) => {
  if (req.session.loggedin) {
    var idCompost = req.params.id;

    req.getConnection((error, conn) => {
      conn.query(
        "SELECT * FROM usuarios ",
        (error, results) => {
          if (error) {
            console.log(error);
          } else {
            req.getConnection((error, conn) => {
              conn.query("SELECT * FROM composteras WHERE id = ?", [idCompost], (error, resultscompost) => {
                if (error) {
                  console.log(error);
                } else {

                  res.render("formVisitaSeguimiento", {
                    results: results,
                    resultscompost: resultscompost,
                    login: true,
                    ID: req.session.ID,
                    name: req.session.name,
                    role: req.session.role,
                    idCompost: idCompost
                  });
                }
              }
              );
            });
          }
        }
      );
    });
  } else {
    res.redirect("/login");
  }
};


controller.formCargeBiomasa = (req, res) => {
  if (req.session.loggedin) {
    var idCompost = req.params.id;

    req.getConnection((error, conn) => {
      conn.query(
        "SELECT id, nombre, cargo FROM usuarios ",
        (error, results) => {
          if (error) {
            console.log(error);
          } else {
            req.getConnection((error, conn) => {
              conn.query("SELECT * FROM composteras WHERE id = ?", [idCompost], (error, resultscompost) => {
                if (error) {
                  console.log(error);
                } else {

                  res.render("formCargeBiomasa", {
                    results: results,
                    resultscompost: resultscompost,
                    login: true,
                    ID: req.session.ID,
                    name: req.session.name,
                    role: req.session.role,
                    idCompost: idCompost
                  });
                }
              }
              );
            });
          }
        }
      );
    });
  } else {
    res.redirect("/login");
  }
};
controller.formDescargeCompost = (req, res) => {
  if (req.session.loggedin) {
    var idCompost = req.params.id;

    req.getConnection((error, conn) => {
      conn.query(
        "SELECT id, nombre, cargo FROM usuarios ",
        (error, results) => {
          if (error) {
            console.log(error);
          } else {

            res.render("formDescargeCompost", {
              results: results,
              login: true,
              ID: req.session.ID,
              name: req.session.name,
              role: req.session.role,
              idCompost: idCompost
            });
          }
        }
      );
    });
  } else {
    res.redirect("/login");
  }
};
controller.formCompostMadurado = (req, res) => {
  if (req.session.loggedin) {
    var idCompost = req.params.id;
    req.getConnection((error, conn) => {
      conn.query(
        "SELECT id, nombre, cargo FROM usuarios ",
        (error, results) => {
          if (error) {
            console.log(error);
          } else {
            res.render("formCompostMadurado", {
              results: results,
              login: true,
              ID: req.session.ID,
              name: req.session.name,
              role: req.session.role,
              idCompost: idCompost
            });
          }
        }
      );
    });
  } else {
    res.redirect("/login");
  }
};

controller.composterasNewSend = async (req, res) => {
  if (req.session.loggedin) {
    let foto;
    if (req.file) {
      foto = req.file.filename;
    } else {
      foto = null;
    }
    let firma = 'firma';
    let serialCompostera = req.body.codBenefic;
    const fecha_entrega = req.body.fecha_entrega;
    const id_quienEntrega = req.body.id_quienEntrega;
    const codBenefic = req.body.codBenefic;
    const nombre_quienEntrega = req.body.nombre_quienEntrega;
    const nombreInstitucion = req.body.nombreInstitucion;
    const nombreResponsable = req.body.nombreResponsable;
    const celularResponsable = req.body.celularResponsable;
    const email = req.body.email;
    const identificacionResponsable = req.body.identificacionResponsable;
    const capacidadCompostera = req.body.capacidadCompostera;
    const coordenadas = req.body.coordenadas;
    const direccionInstitucion = req.body.direccionInstitucion;
    const notaCompostera = req.body.notaCompostera;
    const estado = req.body.estado;
    const lat = req.body.lat;
    const log = req.body.log;
    const tipoIdentifi = req.body.tipoIdentifi;
    const Localidad = req.body.Localidad;
    const Barrio = req.body.Barrio;

    let passwordHaash = await bcryptjs.hash(identificacionResponsable, 8);


    req.getConnection((error, conn) => {
      conn.query(
        "SELECT * FROM usuarios WHERE email = ?", [email],
        (error, resultsusuarios) => {
          if (error) {
            console.log(error);
            res.render("notification", {
              alert: true,
              alertTitle: "Notificacion",
              alertMessage: error,
              alertIcon: "danger",
              showConfirmButton: false,
              ruta: "totalcomposteras",
              timer: 3000,
            });
          } else {
            if (resultsusuarios.length == 0) {
              req.getConnection((error, conn) => {
                conn.query(
                  "INSERT INTO usuarios SET ?",
                  {
                    nombre: nombreResponsable,
                    user: email,
                    password: passwordHaash,
                    email: email,
                    celular: celularResponsable,
                    tipoIdentifi: tipoIdentifi,
                    identificacion: identificacionResponsable,
                    cargo: 'user1',
                    dependencia: 'CLIENTES',
                  },
                  (error) => {
                    if (error) {
                      console.log(error);
                    } else {
                      req.getConnection((error, conn) => {
                        conn.query(
                          "SELECT * FROM usuarios ORDER by id DESC LIMIT 1 ",
                          (error, results) => {
                            if (error) {
                              console.log(error);
                              res.render("notification", {
                                alert: true,
                                alertTitle: "Notificacion",
                                alertMessage: error,
                                alertIcon: "danger",
                                showConfirmButton: false,
                                ruta: "totalcomposteras",
                                timer: 3000,
                              });
                            } else {

                              var id_responsable = results[0].id
                              req.getConnection((error, conn) => {
                                conn.query(
                                  "INSERT INTO composteras SET ?",
                                  {
                                    coordenas: coordenadas,
                                    codBenefic: codBenefic,
                                    fecha_inicial: fecha_entrega,
                                    nombre_institucion: nombreInstitucion,
                                    nombre_responsable: nombreResponsable,
                                    celular_responsable: celularResponsable,
                                    Nota: notaCompostera,
                                    estado: estado,
                                    foto1_compostera: foto,
                                    firma: firma,
                                    Direccion_compostera: direccionInstitucion,
                                    localidad_compostera: Barrio,
                                    barrio_compostera: direccionInstitucion,
                                    id_usuario: id_responsable,
                                    nombre_quientrega: nombre_quienEntrega,
                                    serial_compostera: serialCompostera,
                                    Capacidad_compostera: capacidadCompostera,
                                    lat: lat,
                                    log: log
                                  },
                                  (error) => {
                                    if (error) {
                                      console.log(error);
                                    } else {
                                      req.getConnection((error, conn) => {
                                        conn.query(
                                          "SELECT * FROM composteras ORDER by id DESC LIMIT 1 ",
                                          (error, results) => {
                                            if (error) {
                                              console.log(error);
                                              res.render("notification", {
                                                alert: true,
                                                alertTitle: "Notificacion",
                                                alertMessage: error,
                                                alertIcon: "danger",
                                                showConfirmButton: false,
                                                ruta: "totalcomposteras",
                                                timer: 3000,
                                              });
                                            } else {
                                              var iditemcompostera = results[0].id
                                              console.log(results);
                                              req.getConnection((error, conn) => {
                                                conn.query(
                                                  "INSERT INTO registrodiarioestadooperacion SET ?",
                                                  {
                                                    id_compostera: iditemcompostera,
                                                    fecha_registro: fecha_entrega,
                                                    clima: 'NA',
                                                    Pinsectos: 'NA',
                                                    Proedores: 'NA',
                                                    Polor: 'NA',
                                                    MaterialEstructurante: 'NA',
                                                    CantidadME: 0,
                                                    Materialorganico: 'NA',
                                                    CantidadMO: 0,
                                                    FotoEstadoActual: foto,
                                                    TipoRegistro: 'INICIAL',
                                                    id_quienRegistra: req.session.ID
                                                  },
                                                  (error) => {
                                                    if (error) {
                                                      console.log(error);
                                                      res.render("notification", {
                                                        alert: true,
                                                        alertTitle: "Notificacion",
                                                        alertMessage: error,
                                                        alertIcon: "danger",
                                                        showConfirmButton: false,
                                                        ruta: "totalcomposteras",
                                                        timer: 3000,
                                                      });
                                                    } else {
                                                      res.render("notification", {
                                                        alert: true,
                                                        alertTitle: "Notificacion",
                                                        alertMessage: "Se ha creado exitosamente",
                                                        alertIcon: "success",
                                                        showConfirmButton: false,
                                                        ruta: "home",
                                                        timer: 3000,
                                                      });
                                                    }
                                                  }
                                                );
                                              });
                                            }
                                          }
                                        );
                                      });

                                    }
                                  }
                                );
                              });
                            }
                          }
                        );
                      });
                    }
                  }
                );
              });
            } else {
              var id_usuario = resultsusuarios[0].id
              req.getConnection((error, conn) => {
                conn.query(
                  "INSERT INTO composteras SET ?",
                  {
                    coordenas: coordenadas,
                    codBenefic: codBenefic,
                    fecha_inicial: fecha_entrega,
                    nombre_institucion: nombreInstitucion,
                    nombre_responsable: nombreResponsable,
                    celular_responsable: celularResponsable,
                    Nota: notaCompostera,
                    estado: estado,
                    foto1_compostera: foto,
                    firma: firma,
                    Direccion_compostera: direccionInstitucion,
                    localidad_compostera: Barrio,
                    barrio_compostera: direccionInstitucion,
                    id_usuario: id_usuario,
                    nombre_quientrega: nombre_quienEntrega,
                    serial_compostera: serialCompostera,
                    Capacidad_compostera: capacidadCompostera,
                    lat: lat,
                    log: log
                  },
                  (error) => {
                    if (error) {
                      console.log(error);
                    } else {
                      req.getConnection((error, conn) => {
                        conn.query(
                          "SELECT * FROM composteras ORDER by id DESC LIMIT 1 ",
                          (error, results) => {
                            if (error) {
                              console.log(error);
                              res.render("notification", {
                                alert: true,
                                alertTitle: "Notificacion",
                                alertMessage: error,
                                alertIcon: "danger",
                                showConfirmButton: false,
                                ruta: "totalcomposteras",
                                timer: 3000,
                              });
                            } else {
                              var iditemcompostera = results[0].id
                              console.log(results);
                              req.getConnection((error, conn) => {
                                conn.query(
                                  "INSERT INTO registrodiarioestadooperacion SET ?",
                                  {
                                    id_compostera: iditemcompostera,
                                    fecha_registro: fecha_entrega,
                                    clima: 'NA',
                                    Pinsectos: 'NA',
                                    Proedores: 'NA',
                                    Polor: 'NA',
                                    MaterialEstructurante: 'NA',
                                    CantidadME: 0,
                                    Materialorganico: 'NA',
                                    CantidadMO: 0,
                                    FotoEstadoActual: foto,
                                    TipoRegistro: 'INICIAL',
                                    id_quienRegistra: req.session.ID
                                  },
                                  (error) => {
                                    if (error) {
                                      console.log(error);
                                      res.render("notification", {
                                        alert: true,
                                        alertTitle: "Notificacion",
                                        alertMessage: error,
                                        alertIcon: "danger",
                                        showConfirmButton: false,
                                        ruta: "totalcomposteras",
                                        timer: 3000,
                                      });
                                    } else {
                                      res.render("notification", {
                                        alert: true,
                                        alertTitle: "Notificacion",
                                        alertMessage: "Se ha creado exitosamente",
                                        alertIcon: "success",
                                        showConfirmButton: false,
                                        ruta: "home",
                                        timer: 3000,
                                      });
                                    }
                                  }
                                );
                              });
                            }
                          }
                        );
                      });

                    }
                  }
                );
              });


            }
          }
        })
    });








  } else {
    res.redirect("/login");
  }
};









controller.formVisitaSeguimientoSend = (req, res) => {
  if (req.session.loggedin) {
    let foto;
    if (req.file) {
      foto = req.file.filename;
    } else {
      foto = null;
    }
    const firma = req.body.saveFirmaText;
    const uploadImages = req.body.uploadImages;
    const fecha_registro = req.body.fecha_registro;
    const hora_registro = req.body.hora_registro;
    const estClima = req.body.estClima;
    const temperatura_compost = req.body.temperatura_compost;
    const humedad_compost = req.body.humedad_compost;
    const prelixiviados = req.body.prelixiviados;
    const prevectores = req.body.prevectores;
    const ausenciaolores = req.body.ausenciaolores;
    const id_quienRegistra = req.body.id_quienRegistra;
    const nombre_quienRegistra = req.body.nombre_quienRegistra;
    const idCompost = req.body.idCompost;
    const hallazgoFVS = req.body.hallazgoFVS;
    const causaFVS = req.body.causaFVS;
    const recomendacionesFVS = req.body.recomendacionesFVS;
    req.getConnection((error, conn) => {
      conn.query(
        "INSERT INTO registrodiarioestadooperacion SET ?",
        {
          id_compostera: idCompost,
          fecha_registro: fecha_registro,
          hora_registro: hora_registro,
          clima: estClima,
          temperatura: temperatura_compost,
          humedad: humedad_compost,
          Pinsectos: prevectores,
          Proedores: prevectores,
          Polor: ausenciaolores,
          prelixiviados: prelixiviados,
          TipoRegistro: 'VISITASEGUIMIENTO',
          FotoEstadoActual: foto,
          id_quienRegistra: id_quienRegistra,
          hallazgoFVS: hallazgoFVS,
          causaFVS: causaFVS,
          recomendacionesFVS: recomendacionesFVS,
          firma: firma,
        },
        (error) => {
          if (error) {
            console.log(error);
            res.render("notification", {
              alert: true,
              alertTitle: "Notificacion",
              alertMessage: error,
              alertIcon: "danger",
              showConfirmButton: false,
              ruta: "totalcomposteras",
              timer: 3000,
            });
          } else {
            req.getConnection((error, conn) => {
              conn.query("SELECT * FROM registrodiarioestadooperacion ORDER BY id DESC LIMIT 1;", (error, result) => {
                if (error) {
                  console.log(error);
                } else {
                  res.render("seguimientofoto1", {
                    login: true,
                    ID: req.session.ID,
                    name: req.session.name,
                    role: req.session.role,
                    result: result
                  });
                }
              }
              );
            });
          }
        }
      );
    });

  } else {
    res.redirect("/login");
  }
};

controller.seguimientofoto1 = (req, res) => {
  if (req.session.loggedin) {
    var idCompost = req.params.id;
    req.getConnection((error, conn) => {
      conn.query(
        "SELECT * FROM usuarios ",
        (error, results) => {
          if (error) {
            console.log(error);
          } else {
            req.getConnection((error, conn) => {
              conn.query("SELECT * FROM composteras WHERE id = ?", [idCompost], (error, resultscompost) => {
                if (error) {
                  console.log(error);
                } else {

                  res.render("formVisitaSeguimiento", {
                    results: results,
                    resultscompost: resultscompost,
                    login: true,
                    ID: req.session.ID,
                    name: req.session.name,
                    role: req.session.role,
                    idCompost: idCompost
                  });
                }
              }
              );
            });
          }
        }
      );
    });
  } else {
    res.redirect("/login");
  }
};


controller.subirFoto = (req, res) => {
  if (req.session.loggedin) {

    const foto = req.file;
    const fotoname = req.file.filename;
    const id = req.body.id;

    if (foto && id) {
      req.getConnection((error, conn) => {
        conn.query(
          "INSERT INTO archivos_usuarios SET ?",
          {
            id_registro: id,
            nombre: fotoname,
            archivo: fotoname
          },
          (error) => {
            if (error) {
              res.status(400).json({ error: 'Error al almacenar en la base de datos.' });
            } else {
              const url = `/uploads/${fotoname}`;
              res.json({ url: url });
            }
          }
        );
      });
    } else {
      res.status(400).json({ error: 'Por favor, proporciona una foto y un ID.' });
    }

  } else {
    res.redirect("/login");
  }
};



controller.agregarBiomasaSend = (req, res) => {
  if (req.session.loggedin) {
    let foto;
    if (req.file) {
      foto = req.file.filename;
    } else {
      foto = null;
    }
    let firma = 'firma';
    let serialCompostera = '0000000000';
    const fecha_registro = req.body.fecha_registro;
    const hora_registro = req.body.hora_registro;
    const ctnbiomasa = req.body.ctnbiomasa;
    const ctnmaterialestructurante = req.body.ctnmaterialestructurante;
    var totalctnbiomasa = ctnbiomasa * 0.25 * 0.4 * 0.6 * 1000 * 0.55;
    var totalctnmestructurante = ctnmaterialestructurante * 0.25 * 0.4 * 0.6 * 1000 * 0.55;
    const prevectores = req.body.prevectores;
    const ausenciaolores = req.body.ausenciaolores;
    const estClima = req.body.estClima;
    const temperatura = req.body.temperatura;
    const humedad = req.body.humedad;
    const id_quienRegistra = req.body.id_quienRegistra;
    const nombre_quienRegistra = req.body.nombre_quienRegistra;
    const idCompost = req.body.idCompost;
    const hallazgoFVS = req.body.hallazgoFVS;


    if (prevectores == 'ratas') {
      var Pinsectos = 'no'
      var Proedores = 'si'
    } else if (prevectores == 'moscas') {
      var Pinsectos = 'si'
      var Proedores = 'no'
    }

    req.getConnection((error, conn) => {
      conn.query(
        "INSERT INTO registrodiarioestadooperacion SET ?",
        {
          id_compostera: idCompost,
          fecha_registro: fecha_registro,
          hora_registro: hora_registro,
          clima: estClima,
          temperatura: temperatura,
          humedad: humedad,
          Pinsectos: Pinsectos,
          Proedores: Proedores,
          Polor: ausenciaolores,
          MaterialEstructurante: 'NA',
          CantidadME: totalctnmestructurante,
          Materialorganico: 'NA',
          CantidadMO: totalctnbiomasa,
          FotoEstadoActual: foto,
          TipoRegistro: 'CARGABIOMASA',
          id_quienRegistra: id_quienRegistra,
          hallazgoFVS: hallazgoFVS
        },
        (error) => {
          if (error) {
            console.log(error);
            res.render("notification", {
              alert: true,
              alertTitle: "Notificacion",
              alertMessage: error,
              alertIcon: "danger",
              showConfirmButton: false,
              ruta: "totalcomposteras",
              timer: 3000,
            });
          } else {
            res.render("notification", {
              alert: true,
              alertTitle: "Notificacion",
              alertMessage: "Se ha cargado exitosamente",
              alertIcon: "success",
              showConfirmButton: false,
              ruta: "totalcomposteraslist",
              timer: 3000,
            });

          }
        }
      );
    });


  } else {
    res.redirect("/login");
  }
};
controller.descargeCompostSend = (req, res) => {
  if (req.session.loggedin) {
    let foto = req.file.filename;
    let firma = 'firma';
    let serialCompostera = '0000000000';
    const fecha_registro = req.body.fecha_registro;
    const hora_registro = req.body.hora_registro;
    const ctnDescargada = req.body.ctnDescargada;

    const ausenciaolores = req.body.ausenciaolores;
    const descrPreolores = req.body.descrPreolores;

    const temperatura = req.body.temperatura;
    const humedad = req.body.humedad;
    const id_quienRegistra = req.body.id_quienRegistra;
    const nombre_quienRegistra = req.body.nombre_quienRegistra;
    const idCompost = req.body.idCompost;


    req.getConnection((error, conn) => {
      conn.query(
        "INSERT INTO registrodiarioestadooperacion SET ?",
        {
          id_compostera: idCompost,
          fecha_registro: fecha_registro,
          hora_registro: hora_registro,
          cantidadCompost: ctnDescargada,
          temperatura: temperatura,
          humedad: humedad,
          descrPreolores: descrPreolores,
          Polor: ausenciaolores,
          FotoEstadoActual: foto,
          TipoRegistro: 'DESCARGECOMPOST',
          id_quienRegistra: id_quienRegistra
        },
        (error) => {
          if (error) {
            console.log(error);
            res.render("notification", {
              alert: true,
              alertTitle: "Notificacion",
              alertMessage: error,
              alertIcon: "danger",
              showConfirmButton: false,
              ruta: "totalcomposteraslist",
              timer: 3000,
            });
          } else {
            res.render("notification", {
              alert: true,
              alertTitle: "Notificacion",
              alertMessage: "Se ha cargado exitosamente",
              alertIcon: "success",
              showConfirmButton: false,
              ruta: "totalcomposteraslist",
              timer: 3000,
            });
          }
        }
      );
    });


  } else {
    res.redirect("/login");
  }
};
controller.compostMaduradoSend = (req, res) => {
  if (req.session.loggedin) {
    let foto = req.file.filename;
    let firma = 'firma';
    let serialCompostera = '0000000000';
    const fecha_registro = req.body.fecha_registro;
    const hora_registro = req.body.hora_registro;
    const ctnDescargada = req.body.ctnDescargada;

    const ausenciaolores = req.body.ausenciaolores;
    const descrPreolores = req.body.descrPreolores;

    const temperatura = req.body.temperatura;
    const humedad = req.body.humedad;
    const id_quienRegistra = req.body.id_quienRegistra;
    const nombre_quienRegistra = req.body.nombre_quienRegistra;
    const idCompost = req.body.idCompost;

    req.getConnection((error, conn) => {
      conn.query(
        "INSERT INTO registrodiarioestadooperacion SET ?",
        {
          id_compostera: idCompost,
          fecha_registro: fecha_registro,
          hora_registro: hora_registro,
          cantidadCompost: ctnDescargada,
          temperatura: temperatura,
          humedad: humedad,
          descrPreolores: descrPreolores,
          Polor: ausenciaolores,
          FotoEstadoActual: foto,
          TipoRegistro: 'COMPOSTMADURADO',
          id_quienRegistra: id_quienRegistra
        },
        (error) => {
          if (error) {
            console.log(error);
            res.render("notification", {
              alert: true,
              alertTitle: "Notificacion",
              alertMessage: error,
              alertIcon: "danger",
              showConfirmButton: false,
              ruta: "totalcomposteraslist",
              timer: 3000,
            });
          } else {
            res.render("notification", {
              alert: true,
              alertTitle: "Notificacion",
              alertMessage: "Se ha cargado exitosamente",
              alertIcon: "success",
              showConfirmButton: false,
              ruta: "totalcomposteraslist",
              timer: 3000,
            });
          }
        }
      );
    });


  } else {
    res.redirect("/login");
  }
};









controller.cronogramaIncompletos = (req, res) => {
  if (req.session.loggedin) {
    req.getConnection((error, conn) => {
      conn.query(
        "SELECT * FROM cronogramas WHERE estado = 'INCOMPLETO' ORDER BY cronogramas.fecha DESC",
        (error, results) => {
          if (error) {
            console.log(error);
          } else {
            const cuantiti = results.length
            req.getConnection((error, conn) => {
              conn.query("SELECT DISTINCT (fecha) FROM cronogramas ORDER BY cronogramas.fecha DESC LIMIT ?", [cuantiti], (error, resultado) => {
                if (error) {
                  console.log(error);
                } else {
                  res.render("cronograma_menu_servicio_c", {
                    total: results.length,
                    results: results,
                    resultado: resultado,
                    login: true,
                    name: req.session.name,
                    role: req.session.role,
                    id_user: req.session.ID,
                  });
                }
              })
            })
          }
        }
      );
    });
  } else {
    res.redirect("/login");
  }
};

controller.cronogramaCompletos = (req, res) => {
  if (req.session.loggedin) {
    req.getConnection((error, conn) => {
      conn.query(
        "SELECT * FROM cronogramas WHERE estado = 'COMPLETADO' ORDER BY cronogramas.fecha_fin DESC",
        (error, results) => {
          if (error) {
            console.log(error);
          } else {
            const cuantiti = results.length
            req.getConnection((error, conn) => {
              conn.query("SELECT DISTINCT (fecha) FROM cronogramas ORDER BY cronogramas.fecha DESC LIMIT ?", [cuantiti], (error, resultado) => {
                if (error) {
                  console.log(error);
                } else {
                  console.log(cuantiti);
                  res.render("cronograma_menu_servicio_c", {
                    total: results.length,
                    results: results,
                    resultado: resultado,
                    login: true,
                    name: req.session.name,
                    role: req.session.role,
                    id_user: req.session.ID,
                  });
                }
              })
            })
          }
        }
      );
    });
  } else {
    res.redirect("/login");
  }
};


controller.cronogramaReprogramados = (req, res) => {

  if (req.session.loggedin) {
    req.getConnection((error, conn) => {
      conn.query(
        "SELECT * FROM cronogramas WHERE estado = 'REPROGRAMAR' ORDER BY cronogramas.fecha DESC",
        (error, results) => {
          if (error) {
            console.log(error);
          } else {
            const cuantiti = results.length
            req.getConnection((error, conn) => {
              conn.query("SELECT DISTINCT (fecha) FROM cronogramas ORDER BY cronogramas.fecha DESC LIMIT ?", [cuantiti], (error, resultado) => {
                if (error) {
                  console.log(error);
                } else {
                  res.render("cronograma_menu_servicio_c", {
                    total: results.length,
                    results: results,
                    resultado: resultado,
                    login: true,
                    name: req.session.name,
                    role: req.session.role,
                    id_user: req.session.ID,
                  });
                }
              })
            })
          }
        }
      );
    });
  } else {
    res.redirect("/login");
  }
};

controller.delatecompostera = (req, res) => {
  if (req.session.loggedin) {
    const id = req.params.id;
    var fecha = new Date(); //Fecha actual
    var mes = fecha.getMonth() + 1; //obteniendo mes
    var dia = fecha.getDate();
    var ano = fecha.getFullYear(); //obteniendo año
    if (dia < 10) dia = "0" + dia; //agrega cero si el menor de 10
    if (mes < 10) mes = "0" + mes; //agrega cero si el menor de 10
    var value = ano + "-" + mes + "-" + dia;
    var horas = fecha.getHours();
    var minutos = fecha.getMinutes();
    var segundos = fecha.getSeconds();
    var horaActual = horas + ':' + minutos + ':' + segundos
    console.log("Hora actual:", horas + ":" + minutos + ":" + segundos);
    var fechaACTUAL = String(value);

    req.getConnection((error, conn) => {
      conn.query(
        "DELETE FROM composteras WHERE id= ?",
        [id],
        (error, results) => {
          if (error) {
            console.log(error);
          } else {
            req.getConnection((error, conn) => {
              conn.query(
                "INSERT INTO softlogs SET ?",
                {
                  fecha: fechaACTUAL,
                  hora: horaActual,
                  descripcion: 'Compostera eliminada de la base de datos',
                  responsable: req.session.ID,
                  id_usuario: req.session.name,

                },
                (error) => {
                  if (error) {
                    console.log(error);

                  } else {
                    res.redirect("/totalcomposteras");
                  }
                }
              );
            });

          }
        }
      );
    });
  } else {
    res.redirect("/login");
  }
};

controller.editCompostera = (req, res) => {
  if (req.session.loggedin) {
    let id = req.params.id;
    req.getConnection((error, conn) => {
      conn.query(
        "SELECT * FROM composteras WHERE id = ? ",
        [id],
        (error, results) => {
          if (error) {
            console.log(error);
          } else {
            id_usuario = results[0].id_usuario;
            req.getConnection((error, conn) => {
              conn.query("SELECT * FROM usuarios  WHERE id = ?", [id_usuario], (error, resultsUser) => {
                if (error) {
                  console.log(error);
                } else {
                  res.render("editCompostera", {
                    data: results[0],
                    results: resultsUser,
                    login: true,
                    ID: req.session.ID,
                    name: req.session.name,
                    role: req.session.role,
                  });

                }
              }
              );
            });

          }
        }
      );
    });

  } else {
    res.redirect("/login");
  }
};


controller.cronogramaSolidReprogramar = (req, res) => {
  if (req.session.loggedin) {
    let id = req.params.id;
    req.getConnection((error, conn) => {
      conn.query(
        "SELECT * FROM cronogramas WHERE id = ? ",
        [id],
        (error, results) => {
          if (error) {
            console.log(error);
          } else {
            res.render("solidReproCronograma", {
              data: results[0],
              login: true,
              name: req.session.name,
            });
          }
        }
      );
    });
  } else {
    res.redirect("/login");

  }
};



controller.cronogramaSolidReprogramarSend = (req, res) => {
  if (req.session.loggedin) {
    let id = req.body.id;
    let evidencia = req.body.evidencia;
    let estado = "REPROGRAMAR";
    req.getConnection((error, conn) => {
      conn.query(
        "UPDATE cronogramas SET ? WHERE id = ? ",
        [
          {
            evidencias_reprogramacion: evidencia,
            estado: estado,
          },
          id,
        ],
        (error, results) => {
          if (error) {
            console.log(error);
          } else {
            console.log(results);
            res.redirect("/cronogramaReprogramar");
          }
        }
      );
    });
  } else {
    res.redirect("/login");
  }

};


controller.cronogramaReportReprogramar = (req, res) => {
  if (req.session.loggedin) {
    let id = req.params.id;
    req.getConnection((error, conn) => {
      conn.query(
        "SELECT * FROM cronogramas WHERE id = ? ",
        [id],
        (error, results) => {
          if (error) {
            console.log(error);
          } else {
            res.render("repoReprogramarCronograma", {
              data: results[0],
              login: true,
              name: req.session.name,
            });
          }
        }
      );
    });
  } else {
    res.redirect("/login");
  }

};



controller.cronogramaReportReprogramarSend = (req, res) => {
  if (req.session.loggedin) {
    let id = req.body.id;
    let fecha = req.body.fecha;
    let hora = req.body.hora;
    let evidencia = "-";
    let estado = "INCOMPLETO";
    req.getConnection((error, conn) => {
      conn.query(
        "UPDATE cronogramas SET ? WHERE id = ? ",
        [
          {
            evidencias_reprogramacion: evidencia,
            estado: estado,
            hora: hora,
            fecha: fecha,
          },
          id,
        ],
        (error, results) => {
          if (error) {
            console.log(error);
          } else {
            console.log(results);
            res.redirect("/totalcomposteras");
          }
        }
      );
    });
  } else {
    res.redirect("/login");
  }

};


controller.cronogramaCompletar = (req, res) => {
  if (req.session.loggedin) {
    let id = req.params.id;
    res.render("cronogramaComplit", {
      id: id,
      login: true,
      name: req.session.name,
      role: req.session.role,
      id_user: req.session.ID,
    });
  } else {
    res.redirect("/login")
  }

};

controller.totalcomposteras = (req, res) => {
  if (req.session.loggedin) {
    var fecha = new Date(); //Fecha actual
    var mes = fecha.getMonth() + 1; //obteniendo mes
    var dia = fecha.getDate();
    var ano = fecha.getFullYear(); //obteniendo aÃ±o
    if (dia < 10) dia = "0" + dia; //agrega cero si el menor de 10
    if (mes < 10) mes = "0" + mes; //agrega cero si el menor de 10
    var value = ano + "-" + mes + "-" + dia;
    var fechaACTUAL = String(value);
    console.log(fechaACTUAL);
    req.getConnection((error, conn) => {
      conn.query("SELECT * FROM composteras ORDER BY composteras.fecha_inicial DESC ", (error, results) => {
        if (error) {
          console.log(error);
        } else {
          req.getConnection((error, conn) => {
            conn.query("SELECT DISTINCT (id_compostera) FROM registrodiarioestadooperacion WHERE fecha_registro != ?", [fechaACTUAL], (error, resultado) => {
              if (error) {
                console.log(error);
              } else {
                req.getConnection((error, conn) => {
                  conn.query("SELECT DISTINCT (id_compostera) FROM registrodiarioestadooperacion WHERE TipoRegistro !='INICIAL' AND fecha_registro = ?", [fechaACTUAL], (error, resultadoRegistros) => {
                    if (error) {
                      console.log(error);
                    } else {
                      req.getConnection((error, conn) => {
                        conn.query("SELECT DISTINCT (id_compostera) FROM registrodiarioestadooperacion WHERE TipoRegistro = ?", ['INICIAL'], (error, resultadoRegistrosInicial) => {
                          if (error) {
                            console.log(error);
                          } else {
                            req.getConnection((error, conn) => {
                              conn.query("SELECT * FROM registrodiarioestadooperacion ", (error, resTotalRegistros) => {
                                if (error) {
                                  console.log(error);
                                } else {
                                  console.log(resultadoRegistros);
                                  res.render("cronograma_menu_servicio_c", {
                                    total: false,
                                    results: results,
                                    resultado: resultado,
                                    resultadoRegistros: resultadoRegistros,
                                    resultadoRegistrosInicial: resultadoRegistrosInicial,
                                    resTotalRegistros: resTotalRegistros,
                                    fechaACTUAL: fechaACTUAL,
                                    login: true,
                                    name: req.session.name,
                                    role: req.session.role,
                                    id_user: req.session.ID,
                                  });

                                }
                              })
                            })

                          }
                        })
                      })

                    }
                  })
                })
              }
            })
          })

        }
      });
    });
  } else {
    res.redirect("/login");
  }
};
controller.totalcomposteraslist = (req, res) => {
  if (req.session.loggedin) {
    var fecha = new Date(); //Fecha actual
    var mes = fecha.getMonth() + 1; //obteniendo mes
    var dia = fecha.getDate();
    var ano = fecha.getFullYear(); //obteniendo aÃ±o
    if (dia < 10) dia = "0" + dia; //agrega cero si el menor de 10
    if (mes < 10) mes = "0" + mes; //agrega cero si el menor de 10
    var value = ano + "-" + mes + "-" + dia;
    var fechaACTUAL = String(value);
    console.log(fechaACTUAL);
    req.getConnection((error, conn) => {
      conn.query("SELECT * FROM composteras ORDER BY composteras.fecha_inicial DESC ", (error, results) => {
        if (error) {
          console.log(error);
        } else {
          req.getConnection((error, conn) => {
            conn.query("SELECT DISTINCT (id_compostera) FROM registrodiarioestadooperacion WHERE fecha_registro != ?", [fechaACTUAL], (error, resultado) => {
              if (error) {
                console.log(error);
              } else {
                req.getConnection((error, conn) => {
                  conn.query("SELECT DISTINCT (id_compostera) FROM registrodiarioestadooperacion WHERE TipoRegistro !='INICIAL' AND fecha_registro = ?", [fechaACTUAL], (error, resultadoRegistros) => {
                    if (error) {
                      console.log(error);
                    } else {
                      req.getConnection((error, conn) => {
                        conn.query("SELECT DISTINCT (id_compostera) FROM registrodiarioestadooperacion WHERE TipoRegistro = ?", ['INICIAL'], (error, resultadoRegistrosInicial) => {
                          if (error) {
                            console.log(error);
                          } else {
                            req.getConnection((error, conn) => {
                              conn.query("SELECT * FROM registrodiarioestadooperacion ", (error, resTotalRegistros) => {
                                if (error) {
                                  console.log(error);
                                } else {
                                  console.log(resultadoRegistros);
                                  res.render("totalComposterasLista", {
                                    total: false,
                                    results: results,
                                    resultado: resultado,
                                    resultadoRegistros: resultadoRegistros,
                                    resultadoRegistrosInicial: resultadoRegistrosInicial,
                                    resTotalRegistros: resTotalRegistros,
                                    fechaACTUAL: fechaACTUAL,
                                    login: true,
                                    name: req.session.name,
                                    role: req.session.role,
                                    id_user: req.session.ID,
                                  });

                                }
                              })
                            })

                          }
                        })
                      })

                    }
                  })
                })
              }
            })
          })

        }
      });
    });
  } else {
    res.redirect("/login");
  }
};
controller.registrosOperacion = (req, res) => {
  if (req.session.loggedin) {
    var fecha = new Date(); //Fecha actual
    var mes = fecha.getMonth() + 1; //obteniendo mes
    var dia = fecha.getDate();
    var ano = fecha.getFullYear(); //obteniendo aÃ±o
    if (dia < 10) dia = "0" + dia; //agrega cero si el menor de 10
    if (mes < 10) mes = "0" + mes; //agrega cero si el menor de 10
    var value = ano + "-" + mes + "-" + dia;
    var fechaACTUAL = String(value);
    console.log(fechaACTUAL);
    req.getConnection((error, conn) => {
      conn.query("SELECT * FROM registrodiarioestadooperacion WHERE TipoRegistro != 'INICIAL' ORDER BY `registrodiarioestadooperacion`.`id` DESC ", (error, results) => {
        if (error) {
          console.log(error);
        } else {
          req.getConnection((error, conn) => {
            conn.query("SELECT DISTINCT (id_compostera) FROM registrodiarioestadooperacion WHERE fecha_registro != ?", [fechaACTUAL], (error, resultado) => {
              if (error) {
                console.log(error);
              } else {
                req.getConnection((error, conn) => {
                  conn.query("SELECT DISTINCT (id_compostera) FROM registrodiarioestadooperacion WHERE TipoRegistro !='INICIAL' AND fecha_registro = ?", [fechaACTUAL], (error, resultadoRegistros) => {
                    if (error) {
                      console.log(error);
                    } else {
                      req.getConnection((error, conn) => {
                        conn.query("SELECT DISTINCT (id_compostera) FROM registrodiarioestadooperacion WHERE TipoRegistro = ?", ['INICIAL'], (error, resultadoRegistrosInicial) => {
                          if (error) {
                            console.log(error);
                          } else {
                            req.getConnection((error, conn) => {
                              conn.query("SELECT * FROM registrodiarioestadooperacion ", (error, resTotalRegistros) => {
                                if (error) {
                                  console.log(error);
                                } else {
                                  console.log(resultadoRegistros);
                                  res.render("tablaRegistrosOperacion", {
                                    total: false,
                                    results: results,
                                    resultado: resultado,
                                    resultadoRegistros: resultadoRegistros,
                                    resultadoRegistrosInicial: resultadoRegistrosInicial,
                                    resTotalRegistros: resTotalRegistros,
                                    fechaACTUAL: fechaACTUAL,
                                    login: true,
                                    name: req.session.name,
                                    role: req.session.role,
                                    id_user: req.session.ID,
                                  });

                                }
                              })
                            })

                          }
                        })
                      })

                    }
                  })
                })
              }
            })
          })

        }
      });
    });
  } else {
    res.redirect("/login");
  }
};
controller.detallesRegitroOperacion = (req, res) => {
  if (req.session.loggedin) {
    var fecha = new Date(); //Fecha actual
    var mes = fecha.getMonth() + 1; //obteniendo mes
    var dia = fecha.getDate();
    var ano = fecha.getFullYear(); //obteniendo aÃ±o
    if (dia < 10) dia = "0" + dia; //agrega cero si el menor de 10
    if (mes < 10) mes = "0" + mes; //agrega cero si el menor de 10
    var value = ano + "-" + mes + "-" + dia;
    var fechaACTUAL = String(value);
    console.log(fechaACTUAL);
    var idregistro = req.params.id;
    req.getConnection((error, conn) => {
      conn.query("SELECT * FROM registrodiarioestadooperacion WHERE id=?", [idregistro], (error, resultsRegistros) => {
        if (error) {
          console.log(error);
        } else {
          req.getConnection((error, conn) => {
            conn.query("SELECT * FROM archivos_usuarios WHERE id_registro=?", [idregistro], (error, resultsArchivos) => {
              if (error) {
                console.log(error);
              } else {
                res.render("detallesRegistroCompost", {
                  total: false,
                  resultsRegistros: resultsRegistros,
                  resultsArchivos: resultsArchivos,
                  fechaACTUAL: fechaACTUAL,
                  login: true,
                  name: req.session.name,
                  role: req.session.role,
                  id_user: req.session.ID,
                });
              }
            })
          })

        }
      });
    });
  } else {
    res.redirect("/login");
  }
};




controller.composteraRegistroupdate = (req, res) => {
  if (req.session.loggedin) {
    const nameUser = req.session.name;
    let id = req.params.id;
    console.log(id);
    req.getConnection((error, conn) => {
      conn.query(
        "SELECT * FROM composteras WHERE id = ? ",
        [id],
        (error, results) => {
          if (error) {
            console.log(error);
          } else {
            req.getConnection((error, conn) => {
              conn.query(
                "SELECT * FROM lista_dispositivos WHERE quienMeTiene = ? ",
                [nameUser],
                (error, results_disp) => {
                  if (error) {
                    console.log(error);
                  } else {
                    console.log(results_disp);
                    res.render("cronogramaConplit2", {
                      data: results[0],
                      results_disp: results_disp,
                      login: true,
                      name: req.session.name,
                      role: req.session.role,
                      id_user: req.session.ID,
                    });
                  }
                }
              );
            });
          }
        }
      );
    });
  } else {
    res.redirect("/login")
  }

};








controller.editarComposterasSend = (req, res) => {
  if (req.session.loggedin) {
    let foto;
    if (req.file) {
      foto = req.file.filename;
    } else {
      foto = null;
    }
    let id_compostera = req.body.id_compostera;
    let id_usuario = req.body.id_usuario
    const codBenefic = req.body.codBenefic;
    const nombreInstitucion = req.body.nombreInstitucion;
    const nombreResponsable = req.body.nombreResponsable;
    const celularResponsable = req.body.celularResponsable;
    const email = req.body.email;
    const identificacionResponsable = req.body.identificacionResponsable;
    const coordenadas = req.body.coordenadas;
    const direccionInstitucion = req.body.direccionInstitucion;
    const notaCompostera = req.body.notaCompostera;

    const lat = req.body.lat;
    const log = req.body.log;
    const tipoIdentifi = req.body.tipoIdentifi;

    req.getConnection((error, conn) => {
      conn.query(
        "UPDATE composteras SET ? WHERE id = ? ",
        [
          {
            coordenas: coordenadas,
            codBenefic: codBenefic,
            nombre_institucion: nombreInstitucion,
            nombre_responsable: nombreResponsable,
            celular_responsable: celularResponsable,
            Nota: notaCompostera,
            foto1_compostera: foto,
            Direccion_compostera: direccionInstitucion,
            lat: lat,
            log: log
          },
          id_compostera,
        ],
        (error, results) => {
          if (error) {
            console.log(error);
          } else {
            req.getConnection((error, conn) => {
              conn.query(
                "UPDATE usuarios SET ? WHERE id = ? ",
                [
                  {
                    nombre: nombreResponsable,
                    user: email,
                    email: email,
                    celular: celularResponsable,
                    identificacion: identificacionResponsable,
                  },
                  id_usuario,
                ],
                (error, results) => {
                  if (error) {
                    console.log(error);
                  } else {
                    console.log(results);
                    res.redirect("/totalcomposteras");
                  }
                }
              );
            });
          }
        }
      );
    });
  } else {
    res.redirect("/login")
  }
};
controller.actualizarcoordscompost = (req, res) => {
  if (req.session.loggedin) {
    const lastUrl = req.header('Referer') || '/totalcomposteras';
    const id_compostera = req.body.id_compostera;
    const coordenadas = req.body.coordenadas;
    const lat = req.body.lat;
    const log = req.body.log;

    req.getConnection((error, conn) => {
      conn.query(
        "UPDATE composteras SET ? WHERE id = ? ",
        [
          {
            coordenas: coordenadas,
            lat: lat,
            log: log
          },
          id_compostera,
        ],
        (error, results) => {
          if (error) {
            console.log(error);
          } else {
            res.redirect(lastUrl);
          }
        }
      );
    });
  } else {
    res.redirect("/login")
  }
};



controller.cronogramaRadioEnlace = (req, res) => {
  if (req.session.loggedin) {
    var fecha = new Date(); //Fecha actual
    var mes = fecha.getMonth() + 1; //obteniendo mes
    var dia = fecha.getDate();
    var ano = fecha.getFullYear(); //obteniendo año
    if (dia < 10) dia = "0" + dia; //agrega cero si el menor de 10
    if (mes < 10) mes = "0" + mes; //agrega cero si el menor de 10
    var value = ano + "-" + mes + "-" + dia;
    var fechaACTUAL = String(value);
    console.log(fechaACTUAL);
    req.getConnection((error, conn) => {
      conn.query(
        "SELECT * FROM cronogramas WHERE genero = 'Re' && fecha = ?",
        [fechaACTUAL],
        (error, results) => {
          if (error) {
            console.log(error);
          } else {
            req.getConnection((error, conn) => {
              conn.query("SELECT DISTINCT (fecha) FROM cronogramas ORDER BY cronogramas.fecha DESC LIMIT 10", (error, resultado) => {
                if (error) {
                  console.log(error);
                } else {
                  res.render("cronograma_menu_servicio_c", {
                    total: false,
                    results: results,
                    resultado: resultado,
                    login: true,
                    name: req.session.name,
                    role: req.session.role,
                    id_user: req.session.ID,
                  });
                }
              })
            });
          }
        }
      );
    });
  } else {
    res.redirect("/login");
  }
};
controller.cronogramaFibraOptica = (req, res) => {
  if (req.session.loggedin) {
    var fecha = new Date(); //Fecha actual
    var mes = fecha.getMonth() + 1; //obteniendo mes
    var dia = fecha.getDate();
    var ano = fecha.getFullYear(); //obteniendo año
    if (dia < 10) dia = "0" + dia; //agrega cero si el menor de 10
    if (mes < 10) mes = "0" + mes; //agrega cero si el menor de 10
    var value = ano + "-" + mes + "-" + dia;
    var fechaACTUAL = String(value);
    console.log(fechaACTUAL);
    req.getConnection((error, conn) => {
      conn.query(
        "SELECT * FROM cronogramas WHERE genero = 'Fo' && fecha = ?",
        [fechaACTUAL],
        (error, results) => {
          if (error) {
            console.log(error);
          } else {
            req.getConnection((error, conn) => {
              conn.query("SELECT DISTINCT (fecha) FROM cronogramas ORDER BY cronogramas.fecha DESC LIMIT 10", (error, resultado) => {
                if (error) {
                  console.log(error);
                } else {
                  res.render("cronograma_menu_servicio_c", {
                    total: false,
                    results: results,
                    resultado: resultado,
                    login: true,
                    name: req.session.name,
                    role: req.session.role,
                    id_user: req.session.ID,
                  });
                }
              })
            });
          }
        }
      );
    });
  } else {
    res.redirect("/login");
  }
};

controller.cronogramaOrganizarFecha = (req, res) => {
  if (req.session.loggedin) {
    const fechaI = req.body.fechaInicio;
    const fechaF = req.body.fechaFin;

    console.log(fechaI, fechaF)
    req.getConnection((error, conn) => {
      conn.query(
        "SELECT * FROM cronogramas WHERE fecha>= ? &&  fecha<= ?",
        [fechaI, fechaF],
        (error, results) => {
          if (error) {
            console.log(error);
          } else {
            const array = results;
            var orden = array.sort(
              (a, b) =>
                new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
            );
            console.log(orden);
            res.render("cronograma_menu_servicio_c", {
              total: false,
              results: orden,
              login: true,
              name: req.session.name,
              role: req.session.role,
              id_user: req.session.ID,
            });
          }
        }
      );
    });
  } else {
    res.redirect("/login");
  }
};




//estadisticas
controller.pestadisticas = (req, res) => {
  req.getConnection((error, conn) => {
    conn.query(
      "SELECT u.nombre_completo, COUNT(c.id) AS cantidad_clientes FROM clientes c JOIN usuarios u ON c.id_vendedor = u.id GROUP BY u.nombre_completo", (error, resultcliVendedor) => {
        if (error) {
          console.log(error)
        } else {
          console.log(resultcliVendedor)
          req.getConnection((error, conn) => {
            conn.query(
              "SELECT YEAR(fecha_creacion) AS anio,  MONTH(fecha_creacion) AS mes,   COUNT(*) AS cantidad_clientes,  SUM(CASE WHEN roleEstado = 'Aprobado' THEN 1 ELSE 0 END) AS clientes_aprobados, SUM(CASE WHEN roleEstado <> 'Aprobado' THEN 1 ELSE 0 END) AS clientes_no_aprobados FROM clientes GROUP BY YEAR(fecha_creacion), MONTH(fecha_creacion)", (error, resultclano) => {
                if (error) {
                  console.log(error)
                } else {
                  req.getConnection((error, conn) => {
                    conn.query(
                      "SELECT * FROM clientes", (error, result) => {

                        if (error) {
                          console.log(error)
                        } else {
                          res.render('estadisticas', {
                            resultcliVendedor: JSON.stringify(resultcliVendedor),
                            resultclano: JSON.stringify(resultclano),
                            IDuser: req.session.ID,
                            role: req.session.role,
                            login: true,
                            nameUser: req.session.name,
                          }
                          )
                        }
                      })

                  })
                }
              })

          })


        }
      })

  })

}


controller.graficoCompost = (req, res) => {
  const id = req.params.id;
  req.getConnection((error, conn) => {
    conn.query("SELECT  YEAR(fecha_registro) AS ano,  MONTH(fecha_registro) AS mes, SUM(CantidadMO) AS total_kilos  FROM registrodiarioestadooperacion WHERE id_compostera = ? GROUP BY  ano, mes  ORDER BY ano, mes;", [id], (error, chartData) => {
      if (error) {
        console.log(error)
      } else {
        console.log(chartData)
        res.json(JSON.stringify(chartData));
      }
    })

  })

}














module.exports = controller;

