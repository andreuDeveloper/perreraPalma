function myController($scope) {
  
   $scope.animals = [];
   $scope.lastUpdate = feactual;

   $scope.init = function () {

        if (Animals.length) {
            for (let _a of Animals) {
                $scope.animals.push(createAnimal(_a));
            }
        }

        
        $scope.initFilter();
        $scope.doFilter();
   }

   function createAnimal (_animal) {
    
        let dateTokens = entrada[_animal.id].split("/");
        let year = dateTokens[2];
        let month = dateTokens[1];
        let day = dateTokens[0];

       return {
           id: _animal.id,
           fechaEntrada: new Date(year, month, day),
           totalDias: diesAnimal(_animal.id),
           raza: _animal.raza,
           genero: getGender(_animal.caracteristicas),
           edad: getEdad(_animal.caracteristicas),
           jaula: _animal.jaula,
           situacion: getSituacion(_animal.situacion),
           solicitudes: getNumSolicitudes(_animal.situacion),
           especie: getEspecie(_animal.caracteristicas),
           caracteristicas: _animal.caracteristicas
       }
   }
    
    $scope.generos = [
        {value: 0, name: "Todos"},
        {value: 1, name: "Macho"},
        {value: 2, name: "Hembra"}
    ]

    $scope.edades = [
        {value: 0, name: "Todas"},
        {value: 1, name: "Joven"},
        {value: 2, name: "Adulto"},
        {value: 3, name: "Viejo"},
    ]

    $scope.situaciones = [
        {value: 0, name: "Todas"},
        {value: 1, name: "Sin adopción"},
        {value: 2, name: "Renuncia"},
        {value: 3, name: "Adoptado"},
        {value: 4, name: "Vagabundo"},
        {value: 5, name: "Abandonado"},
    ]

    $scope.especies = [
        {value: 0, name: "Todas"},
        {value: 1, name: "Perro"},
        {value: 2, name: "Gato"},
    ]

    function getGender (str) {
        if (str.includes("mascle")) return $scope.generos[1];
        if (str.includes("femella")) return $scope.generos[2];
        return "N/S";
    }

    function getEdad (str) {
        if (str.includes("jove")) return $scope.edades[1];
        if (str.includes("adult")) return $scope.edades[2];
        if (str.includes("vell")) return $scope.edades[3];
        return "N/S";
    }

    function getSituacion (str) {
        if (str.includes("<span class=RE>")) return $scope.situaciones[2];
        if (str.includes("<span class=AD>")) return $scope.situaciones[3];
        if (str.includes("<span class=VA>")) return $scope.situaciones[4];
        if (str.includes("<span class=AB>")) return $scope.situaciones[5];
        return "N/S";
    }

    function getNumSolicitudes(str) {
        let num = null;
        let firstStep = str.split("llista d'espera amb");
        if (firstStep.length > 1) {
            let secStep = firstStep[1].split("sol");
            if (secStep.length)
                num = secStep[0].trim();
        }
        return num;
    }

    function getEspecie (str) {
        if (str.includes("canina")) return $scope.especies[1];
        if (str.includes("felina")) return $scope.especies[2];
        return "N/S";
    }


    $scope.initFilter = function() {
        $scope.filter = {
            name: "",
            gender: 0,
            age: 0,
            situacion: 1,
            especie: 0
        }
    }

    $scope.clearFilter = function() {
        $scope.initFilter();
        $scope.doFilter();
    }

    $scope.filtredElements = [];
    $scope.doFilter = function () {
        $scope.filtredElements = [];

        let filterName = $scope.filter.name.toLowerCase();
        for (let animal of $scope.animals) {
            let totalStr = (animal.raza + animal.genero.name +  animal.edad.name + animal.situacion + animal.caracteristicas).toLowerCase();

            if (totalStr.includes(filterName)){

                let correctProp = true;

                if ($scope.filter.especie != 0) {
                    if (animal.especie.value != $scope.filter.especie) correctProp = false;
                }

                if ($scope.filter.gender != 0) {
                    if (animal.genero.value != $scope.filter.gender) correctProp = false;
                }

                if ($scope.filter.age != 0) {
                    if (animal.edad.value != $scope.filter.age) correctProp = false;
                }

                if ($scope.filter.situacion != 0) {

                    if ($scope.filter.situacion > 1) {
                      if (animal.situacion.value != $scope.filter.situacion) correctProp = false;
                    } 

                    //Sin adopcion
                    if ($scope.filter.situacion == 1) {
                        if (![2, 4, 5].includes(animal.situacion.value)) {
                            correctProp = false;
                        } 
                    }
                }

                console.log("All good", correctProp)

                if (correctProp)
                    $scope.filtredElements.push(animal);
            }
        }
    }

  }


  //shits de la web original que paso de mejorar:
  function getData(data) {
    if(!data || data.length < 5) { return null; }
    var camps = data.split('/');
    if(camps.length != 3) { return null; }
    data_dia = camps[0], data_mes = camps[1], data_any = camps[2];
    if(data_dia == null || data_dia.length == 0 || data_mes == null || data_mes.length == 0 ||
        data_any == null || data_any.length == 0) {
    return null;
    }
    if(data_any.length == 2) { data_any = '20' + data_any; }
    else if(data_any.length == 1) { data_any = '200' + data_any; }
    if(data_mes.substring(0, 1) == '0') { data_mes = data_mes.substring(1); }
    if(isNaN(data_dia) || isNaN(data_mes) || isNaN(data_any)) { return null; }
    var data = new Date();
    data.setFullYear(data_any, parseInt(data_mes) - 1, data_dia);
    return data;
  }
  function treatAsUTC(date) {
    var result = new Date(date);
    result.setMinutes(result.getMinutes() - result.getTimezoneOffset());
    return result;
  }
  var millisecondsPerDay = 24 * 60 * 60 * 1000;
  function diffDays(startDate, endDate) {
    return Math.floor(treatAsUTC(endDate) / millisecondsPerDay) - Math.floor(treatAsUTC(startDate) / millisecondsPerDay);
  }
  
  function diesAnimal(idAnimal) {
    if(typeof(idAnimal) == "undefined" || typeof(entrada) == "undefined") { return ""; }
    var dataAnimal = entrada[idAnimal];
    if(typeof(dataAnimal) == "undefined") { return ""; }
    var dataIni = getData(dataAnimal), dataFi = new Date();
    return diffDays(dataIni, dataFi);
  }