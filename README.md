<!-- TABLE OF CONTENTS -->
<details open="open">
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgements">Acknowledgements</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About

This Proof-of-Concept project presents an innovative way of REST API development with many advantages than conventional Resource Modelling approach, including:
* Make input and intermediate resources modelling optional: only API results need to be defined as strong-typed interfaces/types. 
* Type-guarded mappings of the concerned strong-typed interfaces are also strong-typed:
  - TypeScript compiler would highlight mismatches between the models and their mappings.
  - Eliminate the miss, wrong and mis-spelling issues that are common bugs of REST API which might make some testings redundant.
  - The sources of every fields of the result models are transparent.
* A single recursive loop to fetch raw data to compose all properties of the API result models:
  - Easy for development and trouble-shooting with conditional break-points by name.
  - Property names can be case-incensitive to meet the common SQL data sources.
  - Common selecting logic (AND, OR), along with build-in filtering and sorting of elements enabled with simple expressions.
  - Functions can be injected to handle most complicated scenarios.
  - Mapped values can be normalised with dedicated helpers. For example, numbers to be fixed-digits, date/dateTime strings of any different formats can be unified to same format.
* Along with a rich set of default options, the behaviours of the API can be customised easily. For example, when source data is missing, it can return tailored message, throw exception or even return default values for dedicated fields (need a bit extension).
* Multiple type-related help methods make small models reusable and can be used to compose complex models easily.

As a result, implementing a REST API involving multiple resources could happen in 3 steps:
1. Define a model of strong-typed interface/type.
2. Construct a corresponding [Mappings<T>](https://github.com/Cruisoring/api-pro/blob/master/src/types/mappings.ts) directly with all string values, or embedded Mappings<>.
3. Call the [Converter](https://github.com/Cruisoring/api-pro/blob/master/src/helpers/converter.ts).convert() to get the API result from the source data.


### Samples

In the samples folder of this repository, Three of the JSON files present how this utility works: 
1. [RawOrder.json](samples/RawOrder.json): can be treated as raw data fetched from 4 SQL tables: sellers, customers, ordered-items and cancelled-items.
2. [NewOrderMappings.json](samples/NewOrderMappings.json): shows how the [Order](test/models/order.ts) model shall be created from the above [RawOrder.json](samples/RawOrder.json), and you can also see how the [Order model](test/models/order.ts) is defined even if I cannot serialize the type.
3. [NewOrder.json](samples/NewOrder.json): is the result of using above [NewOrderMappings.json](samples/NewOrderMappings.json) to get the expected [Order](test/models/order.ts) model from [RawOrder.json](samples/RawOrder.json).

As you can see, the [NewOrderMappings.json](samples/NewOrderMappings.json) illustrates the relationships between source properties and corresponding API result models, except the last two fields **total** and **totalGst**, having no corresponding values in the source, get the value by calling function instead.

You might also notice there are quite some duplications within [NewOrderMappings.json](samples/NewOrderMappings.json). Fortunately, all duplications can be avoid by using smaller interfaces and corresponding [Mappings<T>](https://github.com/Cruisoring/api-pro/blob/master/src/types/mappings.ts) just like normal OOP to get reusable models and adjusted mappings with help methods.

To skip the implementation details in next section, please refer [order.test.ts](test/order.test.ts) to see how the models and corresponding Mappings<T> are composed and actual conversion would happen accordingly. Notice: all raw data models are not needed, they are created only for illustration purposes.


<!-- GETTING STARTED -->
## Getting Started

This section introduce how to compose simplest [Mappings<T>](https://github.com/Cruisoring/api-pro/blob/master/src/types/mappings.ts) upon expected model **T** defined as either interface or type alias.

A breif introduction of how values are extracted shall be helpful.

### Get value with path

Like the [Lodash _.get()](https://www.geeksforgeeks.org/lodash-_-get-method/) method, the  *getValue()* of [ObjectHelper](src/helpers/object-helper.ts) is used to get the value at path of given object with simple syntax and some modifications:
* Identical path would be used to get the value first, then case-insensitive match return value if only one field with case differences is found.
* Indexers are still supported.
* SPACEs between pathes are ignored.
* **And** and **Or** logic enabled with **&** and **|** respectively.
* Funtions can be used to perform more complex operations.
* To enable evaluation of the function arguments, **>** instead of **.** is used to seperate path segments.

The table summarises special characters and their uses:

| Character | Description | Example |
| --------- | ----------- | ------- |
| **>** | Splitter of paths | parent **>** child: get *parent* node of the source, then get its *child* node value |
| **&** | Join element(s) of the nodes | opt1 **&** opt2: get both *opt1* node and *opt2* node values as an array |
| **|** | Any element if presented | opt1 **|** opt2: value of *opt1* if presented, else value of *opt2* if presented |
| **$** | Root element | **$**node: return *node* value of the root of the given source |
| **()** | Indicator of function | funcName**()**: try to get value with function whose name is *funcName* |


### Simple getValue() examples

The simplest case with sample source data:
``` javascript
const data = { 
  purchased: [ {item: 'milk', price: 3.99, desc: 'yummy', gstFree: true }, {item: 'ruler', price: 1.2, note: '1 foot long'}],
  cancelled: [ {item: 'pencil', price: -0.2, note: 'note like the color'} ]
}
```

`PURCHASED[1] > Price` means the *price* of the second item of *purchased* of the data:
> `ObjectHelper.getValue(data, "PURCHASED[1] > Price ")` => 1.2

`purchased & Cancelled > length` would merge items under *purchased* and *cancelled* as an array to get its length:
> `ObjectHelper.getValue(data, "purchased & Cancelled > length")` => 3

`purchased & Cancelled > 1 > desc | note | item` goes a bit further to get the description of the second item of the array as either its *desc*, or *note* or *item*:
> `ObjectHelper.getValue(data, "purchased & Cancelled > 1 > desc | note | item")` => 'ruler'

Both raw data and result data is usually organised as simple models, then grouped as arrays/lists, operating upon arrays with unknown length, capability of handling arrays is basic.


### Mappings<T>

As we can define models as interface or type **T**, abstract means to get its values can be defined as **Mappings<T>**:
> export type Mappings<T> = { [k in keyof T]: string | Mappings<T[k]> };

The restriction of its keys `[k in keyof T]` would result in compilation errors if the type **T** has different keys than **Mappings<T>** in case:

* adding a new property to the model **T** before updating **Mappings<T>**;
* any property name mismatch between **T** and **Mappings<T>**;
* propery of **T** is of array like `p: element[]`, while the corresponding mapping is not `p: [ArrayMapping<element>]`

As ![Warning of mismatched property](screenshots/Warning%20of%20mismatched%20property.png) shown, such compilation errors would be enough to alert inconsistence of the model changes!


### ArrayMappings<TElement>

To enable array processing, **ArrayKeys** can be merged with **Mappings<T>** to get **ArrayMapping<T>** as below:

```typescript
export interface ArrayKeys {
    RootKey: string; // Key to get the source array
    SortKeys?: string; // Key or Keys to sort the elements of source array, use '+' to join keys
    FilterLambda?: string; // If defined, lambda expression to filter the mapped elements
}
export type ArrayMappings<TElement> = Mappings<TElement> & ArrayKeys;
```

The only mandatory **RootKey** appended would be used to get all elements as an array, then each element would be mapped with the paths of **Mappings<TElement>**. 

The optional **SortKeys** and **FilterLambda** can be used to sort or filter the converted elements.

Within the **SortKeys**, **|** can be used to identify multiple sortKeys, **-** changes the sorting from default ascending to be descending. For example, `+name | -total | quantity` would sort the converted elements by *name* ascendingly first, then *total* descendingly next, and *quantity* ascendingly last.

The **FilterLambda** can be used to specify the lambda expression to filter the converted elements. Please refer [converter.test.ts](test/converter.test.ts) to see examples.



### Managed with Converter<T>

The [Converter<T>](src/helpers/converter.ts) is designed to not only keep the **Mappings<T>** that is used to instruct how to get each property from source data, but also mantain a set of options like:
* If propertyName shall be case-sensitive or not. (default to be case-insensitive)
* How to handle case when source data is missing by either:
  - return *undefined* as the value;
  - or throw Exception;
  - or return messages showing mapping of which property failed.
* Optional named functions when dedicated functions are used to calculate values.
* Conver all numbers to fixed-digits.

Though not implemented, it is possible to implement more features like:
* Format any date string values to unique format.
* Assign default values to each property when source data is missing.
* Detailed logs showing how data is extracted/converted for each single property.


## More thoughts

### Background

The idea of this project can be traced back to one of my previous JAVA PoC project to implement a generic IoT management system which need to connect to ~10 sensors with similar functionality but with different:
* transport: eg. JSON or XML
* name of similar property: like deviceId, sensor_id, NodeID and etc. all denote the same thing.
* numbers in different accuracy.
* date strings of different formats.
* data structure.

It is easy to apply Adapter pattern to convert data from existing IoT devices to an unique format, but the PoC means to support unknown types of sensors to transform all data to unified SQL tables and then presented in unified web apps. With the conceptual identical approach, we have achieved the desired elasticity and plausible performance in JAVA.

In one of my recent project to compare complex data in totally different schemas, I applied the similar design to avoid missing any values from comparison. During this process, it is surprising for me to realise the type system of TypeScript makes such conversions much easier than JAVA.


### Something to be improved

Like most languages, TypeScript/JavaScript would erase the types of the fields that makes it hard to process properties based on its value types. Instead of simply string path to denote how to map values, tuples including default values shall be beneficial.

For simplicity, each field of the result model need to be extracted from the very root that could be avoided with recent access paths or even a whole source data map could enhance the performance further.


### Conclusion

This proof-of-concept project illustrates a new way to develop REST APIs. 

In theory, once and only if the Mappings of the target model is defined, the recursive loop of the properties would apply all techniques to follow the pathes to get corresponding values. All source and intermediate models are not required and any changes would be detected immediately in this process thus save a lot of testing and trouble-shooting efforts: the process, by itself, make it hard to miss any values when problematic mapping relationships are transparent in the definition of Mappings

With limited codes mainly of [ObjectHelper](src/helpers/object-helper.ts) and [Converter](src/helpers/converter.ts) to enable any number of models and their properties, it is possible to polish the codes to implement ValueType based formatting like rounding numbers to fixed-digits in [NumberHelper](src/helpers/number-helper.ts) or uniformed Date stringify.


<!-- LICENSE -->
## License

Distributed under the MIT License.



<!-- CONTACT -->
## Contact

William JIANG - [@william-jiang-67b5a676](https://www.linkedin.com/in/william-jiang-67b5a676/)

Project Link: [https://github.com/Cruisoring/api-pro](https://github.com/Cruisoring/api-pro)
