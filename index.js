function myController($scope) {
  
   $scope.animals = [];

   $scope.init = function () {
        console.log("Animals", Animals);
        console.log("Entradas", entrada)
        if (Animals.length) {
            for (let _a of Animals) {
                $scope.animals.push(createAnimal(_a));
            }
        }

        console.log("Post", $scope.animals)
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
           totalDias: diffDays(new Date(year, month, day), new Date()),
           raza: _animal.raza,
           genero: getGender(_animal.caracteristicas),
           edad: getEdad(_animal.caracteristicas),
           jaula: _animal.jaula,
           situacion: _animal.situacion.replace("<span class=RE>", "").replace("</span>", ""),
           caracteristicas: _animal.caracteristicas
       }
   }

    function treatAsUTC(date) {
        var result = new Date(date);
        result.setMinutes(result.getMinutes() - result.getTimezoneOffset());
        return result;
    }

    let millisecondsPerDay = (24 * 60 * 60 * 1000);
    function diffDays(startDate, endDate) {
        return Math.floor(treatAsUTC(endDate) / millisecondsPerDay) - Math.floor(treatAsUTC(startDate) / millisecondsPerDay);
    }
    
    $scope.generos = [
        {value: 0, name: "Todos"},
        {value: 1, name: "Macho"},
        {value: 2, name: "Hembra"},
        {value: 3, name: "N/S"},
    ]

    $scope.edades = [
        {value: 0, name: "Todas"},
        {value: 1, name: "Joven"},
        {value: 2, name: "Adulto"},
        {value: 3, name: "Viejo"},
    ]

    function getGender (str) {
        if (str.includes("mascle")) return $scope.generos[1];
        if (str.includes("famella")) return $scope.generos[2];
        return $scope.generos[2];
    }

    function getEdad (str) {
        if (str.includes("jove")) return $scope.edades[1];
        if (str.includes("adult")) return $scope.edades[2];
        if (str.includes("vell")) return $scope.edades[3];
        return $scope.generos[2];
    }

    $scope.filter = {
        name: "",
        gender: 0,
        age: 0,
    }

    $scope.clearFilter = function() {
        $scope.filter.name = "";
        $scope.filter.gender = null;
        $scope.filter.age = null;
    }

    $scope.filtredElements = [];
    $scope.doFilter = function () {
        $scope.filtredElements = [];

        let filterName = $scope.filter.name.toLowerCase();
        for (let animal of $scope.animals) {
            let totalStr = (animal.raza + animal.genero.name +  animal.edad.name + animal.situacion + animal.caracteristicas).toLowerCase();

            if (totalStr.includes(filterName)){

                let correctProp = true;
                if ($scope.filter.age != 0) {
                    if (animal.edad.value != $scope.filter.age) correctProp = false;
                }

                if ($scope.filter.gender != 0) {
                    if (animal.genero.value != $scope.filter.gender) correctProp = false;
                }

                if (correctProp)
                    $scope.filtredElements.push(animal);
            }
        }
    }

  }