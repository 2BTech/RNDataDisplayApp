export interface AirQualityRange {
    min: number;
    max: number;
}

export interface AirQualityRangeMap {
    Good: AirQualityRange | undefined;
    Moderate: AirQualityRange | undefined;
    'Unhealthy for sensitive groups': AirQualityRange | undefined;
    Unhealthy: AirQualityRange | undefined;
    'Very Unhealthy': AirQualityRange | undefined;
    Hazardous: AirQualityRange | undefined;
}

export const COAirQualityRanges: AirQualityRangeMap = {
    Good: { min: 0, max: 4, },
    Moderate: { min: 5, max: 9, },
    'Unhealthy for sensitive groups': { min: 10, max: 12, },
    Unhealthy: { min: 13, max: 15, },
    'Very Unhealthy': { min: 16, max: 30, },
    Hazardous: { min: 31, max: Infinity, },
};

export const CO2AirQualityRanges: AirQualityRangeMap = {
    Good: { min: 0, max: 600, },
    Moderate: { min: 601, max: 1000, },
    'Unhealthy for sensitive groups': { min: 1001, max: 2500, },
    Unhealthy: { min: 2501, max: 5000, },
    'Very Unhealthy': { min: 5000, max: Infinity },
    Hazardous: undefined,
}

export const OzoneAirQualityRanges: AirQualityRangeMap = {
    Good: { min: 0, max: 54, },
    Moderate: { min: 55, max: 70, },
    'Unhealthy for sensitive groups': { min: 71, max: 85, },
    Unhealthy: { min: 86, max: 105, },
    'Very Unhealthy': { min: 106, max: 404, },
    Hazardous: { min: 405, max: Infinity, },
};

export const SO2AirQualityRanges: AirQualityRangeMap = {
    Good: { min: 0, max: 35, },
    Moderate: { min: 36, max: 75, },
    'Unhealthy for sensitive groups': { min: 76, max: 185, },
    Unhealthy: { min: 186, max: 304, },
    'Very Unhealthy': { min: 305, max: 604, },
    Hazardous: { min: 605, max: Infinity, },
};

export const NOAirQualityRanges: AirQualityRangeMap = {
    Good: { min: 0, max: 53, },
    Moderate: { min: 54, max: 100, },
    'Unhealthy for sensitive groups': { min: 101, max: 360, },
    Unhealthy: { min: 361, max: 649, },
    'Very Unhealthy': { min: 650, max: 1249, },
    Hazardous: { min: 1250, max: Infinity, },
};

export const NO2AirQualityRanges: AirQualityRangeMap = {
    Good: { min: 0, max: 53, },
    Moderate: { min: 54, max: 100, },
    'Unhealthy for sensitive groups': { min: 101, max: 360, },
    Unhealthy: { min: 361, max: 649, },
    'Very Unhealthy': { min: 650, max: 1249, },
    Hazardous: { min: 1250, max: Infinity, },
};

export const NOxAirQualityRanges: AirQualityRangeMap = {
    Good: { min: 0, max: 53, },
    Moderate: { min: 54, max: 100, },
    'Unhealthy for sensitive groups': { min: 101, max: 360, },
    Unhealthy: { min: 361, max: 649, },
    'Very Unhealthy': { min: 650, max: 1249, },
    Hazardous: { min: 1250, max: Infinity, },
};

export const PM1AirQualityRanges: AirQualityRangeMap = {
    Good: { min: 0, max: 5, },
    Moderate: { min: 6, max: 30, },
    'Unhealthy for sensitive groups': { min: 31, max: 50, },
    Unhealthy: { min: 51, max: 100, },
    'Very Unhealthy': { min: 101, max: Infinity, },
    Hazardous: undefined,
};

export const PM2_5AirQualityRanges: AirQualityRangeMap = {
    Good: { min: 0, max: 12, },
    Moderate: { min: 13, max: 35, },
    'Unhealthy for sensitive groups': { min: 36, max: 55, },
    Unhealthy: { min: 56, max: 150, },
    'Very Unhealthy': { min: 151, max: 250, },
    Hazardous: { min: 251, max: Infinity, },
};

export const PM10AirQualityRanges: AirQualityRangeMap = {
    Good: { min: 0, max: 54, },
    Moderate: { min: 55, max: 154, },
    'Unhealthy for sensitive groups': { min: 155, max: 254, },
    Unhealthy: { min: 255, max: 354, },
    'Very Unhealthy': { min: 355, max: 424, },
    Hazardous: { min: 425, max: Infinity, },
};

export const MethaneAirQualityRanges: AirQualityRangeMap = {
    Good: undefined,
    Moderate: undefined,
    'Unhealthy for sensitive groups': undefined,
    Unhealthy: undefined,
    'Very Unhealthy': undefined,
    Hazardous: undefined,
}

export const AirQualityIndexes = {
    Good: 0,
    Moderate: 1,
    'Unhealthy for sensitive groups': 2,
    Unhealthy: 3,
    'Very unhealthy': 4,
    Hazardous: 5,
};

export const AirQualityColorCodes = {
    Good: '#00E400',
    // Moderate: '#FFE63B',
    Moderate: '#FBB917',
    'Unhealthy for sensitive groups': '#FF7E00',
    Unhealthy: '#FF0000',
    'Very unhealthy': '#99004C',
    Hazardous: '#4C0026',
};

export const AirQualityDescriptions = {
    Good: 'Air quality is satisfactory, and air polution poses little or no risk',
    Moderate: 'Air quality is acceptable. However, there may be a risk for some people, particularly those who are unusually sensitive to air polution.',
    'Unhealthy for sensitive groups': 'Members of sensitive groups may experience helath effects. The general public is less likely to be affected.',
    Unhealthy: 'Some members of the general public may experience health effects; members of sensitive groups may experience more serious health effects.',
    'Very unhealthy': 'Health alert: The risk of health effects is increased for everyone.',
    Hazardous: 'Health warning of emergency conditions; everyone is more likely to be affected.',
};

export const ParameterDescriptions: {[key: string]: string} = {
    CO: '\t\tCO gas refers to carbon monoxide, which is a colorless, odorless, and tasteless gas. It consists of one carbon atom bonded with one oxygen atom, forming a molecule with the chemical formula CO.\n\n\t\tCarbon monoxide is primarily produced through incomplete combustion of carbon-based fuels, such as gasoline, natural gas, coal, and wood. It is released into the atmosphere from various sources, including vehicle exhaust, industrial processes, and residential heating systems. It is also produced by natural processes, such as volcanic activity and forest fires.\n\n\t\tCO gas is a highly toxic substance, particularly because it binds to hemoglobin in red blood cells much more readily than oxygen. When inhaled, it reduces the oxygen-carrying capacity of the blood, leading to a condition known as carbon monoxide poisoning. Symptoms of carbon monoxide poisoning can range from mild, flu-like effects (headaches, dizziness, nausea) to severe neurological damage, unconsciousness, and even death, depending on the concentration and duration of exposure.\n\n\t\tIn addition to its immediate health risks, carbon monoxide also contributes to air pollution and plays a role in climate change. It is considered a greenhouse gas, although its contribution to the overall greenhouse effect is relatively minor compared to other gases like carbon dioxide (CO2). However, it indirectly influences climate by affecting the atmospheric lifetime of other greenhouse gases and by participating in chemical reactions that can impact air quality.\n\n\t\tGiven the dangers associated with carbon monoxide, it is crucial to have proper ventilation systems, carbon monoxide detectors, and to avoid exposure to high concentrations of this gas. Regular maintenance of fuel-burning appliances and the responsible use of combustion processes are essential to minimize the release of carbon monoxide into the environment and protect human health.',
    CO2: '\t\tCO2 gas refers to carbon dioxide, which is a colorless, odorless gas composed of one carbon atom bonded with two oxygen atoms. Its chemical formula is CO2.\n\n\t\tCarbon dioxide is a naturally occurring greenhouse gas that is vital for sustaining life on Earth. It is produced through natural processes such as respiration, volcanic eruptions, and the decomposition of organic matter. However, human activities, particularly the burning of fossil fuels (such as coal, oil, and natural gas) and deforestation, have significantly increased the concentration of CO2 in the atmosphere over the past century.\n\n\t\tCarbon dioxide plays a crucial role in the Earth\'s climate system. It acts as a greenhouse gas, meaning it absorbs and emits infrared radiation, trapping heat in the atmosphere. This phenomenon, known as the greenhouse effect, is essential for maintaining a habitable temperature range on Earth. However, the excessive release of CO2 from human activities has led to an enhanced greenhouse effect, resulting in global warming and climate change.\n\n\t\tThe accumulation of CO2 in the atmosphere contributes to global warming because it traps more heat, leading to an increase in average surface temperatures. This can result in a range of impacts, including rising sea levels, altered weather patterns, increased frequency and intensity of extreme weather events, and disruptions to ecosystems and biodiversity.\n\n\t\tTo address the challenges posed by high CO2 concentrations and climate change, there have been global efforts to reduce greenhouse gas emissions, transition to renewable energy sources, improve energy efficiency, and promote sustainable land use practices. The goal is to mitigate the impacts of climate change and work towards a more sustainable and resilient future.\n\n\t\tIt\'s worth noting that while carbon dioxide is a crucial component of Earth\'s natural systems, the excessive release of CO2 from human activities is causing significant environmental concerns. Therefore, efforts to reduce CO2 emissions and transition to a low-carbon economy are essential for mitigating climate change and ensuring a sustainable future.',
    O3: '\t\tOzone (O3) is a molecule composed of three oxygen atoms. It is a pale blue gas with a pungent odor. Ozone occurs naturally in the Earth\'s atmosphere and is also synthesized for various industrial and commercial applications.\n\n\t\tIn the Earth\'s atmosphere, ozone exists in two regions: the troposphere and the stratosphere.\n\n\t\tTropospheric Ozone: Tropospheric ozone is considered a pollutant and is primarily formed through complex chemical reactions involving pollutants emitted by human activities. These pollutants include nitrogen oxides (NOx) and volatile organic compounds (VOCs), which are released from sources like vehicle emissions, industrial processes, and the burning of fossil fuels. Sunlight and warm temperatures catalyze these reactions, leading to the production of ozone at ground level.\n\n\t\tTropospheric ozone is a significant component of smog and air pollution. It can have detrimental effects on human health and the environment. High levels of ozone in the lower atmosphere can cause respiratory problems, aggravate existing respiratory conditions, and contribute to the formation of respiratory diseases. It can also harm plant life, leading to reduced crop yields and damage to forests and vegetation.\n\n\t\tStratospheric Ozone: Stratospheric ozone plays a vital role in protecting life on Earth. It forms a thin layer, commonly referred to as the ozone layer, located in the stratosphere, approximately 10 to 50 kilometers above the Earth\'s surface. The ozone layer acts as a shield, absorbing the majority of the sun\'s harmful ultraviolet (UV) radiation.\n\n\t\tStratospheric ozone is formed naturally through the interaction of solar UV radiation with oxygen molecules (O2). The energy from UV radiation breaks apart oxygen molecules, and the resulting oxygen atoms (O) react with other oxygen molecules to form ozone (O3). This process is known as the ozone-oxygen cycle.\n\n\t\tThe depletion of stratospheric ozone has been a major environmental concern. Substances called ozone-depleting substances (ODS), such as chlorofluorocarbons (CFCs), halons, and certain other industrial chemicals, were once widely used in various applications like refrigeration, aerosol propellants, and fire suppression systems. When these ODS are released into the atmosphere, they can reach the stratosphere and catalytically destroy ozone molecules, causing the thinning of the ozone layer.\n\n\t\tThe thinning of the ozone layer allows more UV radiation to reach the Earth\'s surface, leading to increased risks of skin cancer, cataracts, and other health issues in humans. It can also have harmful effects on marine ecosystems, phytoplankton, and terrestrial plants.\n\n\t\tTo address the issue of ozone depletion, the international community came together and established the Montreal Protocol in 1987. This global agreement aimed to phase out the production and consumption of ozone-depleting substances. As a result of the protocol\'s implementation, the ozone layer has shown signs of recovery in recent years.\n\n\t\tOverall, while ozone is beneficial in the stratosphere for protecting life on Earth, it poses health and environmental concerns when present in high concentrations at ground level in the form of tropospheric ozone. It is essential to monitor and regulate the emission of ozone precursor pollutants to minimize their adverse effects on human health and the environment.',
    PM1: '\t\tPM1 refers to particulate matter with a diameter of 1 micrometer or less. Particulate matter, often abbreviated as PM, is a complex mixture of solid particles and liquid droplets suspended in the air. These particles can vary in size, composition, and origin.\n\n\t\tPM1 specifically represents the smallest category of particles in terms of diameter. To provide some context, a micrometer (µm) is equal to one-millionth of a meter, making PM1 particles extremely small and virtually invisible to the naked eye. These particles can be directly emitted into the atmosphere, or they can form through complex chemical reactions involving precursor gases.\n\n\t\tPM1 particles have several sources, both natural and human-made. Natural sources include dust, sea salt particles, and biological aerosols such as pollen and spores. Human-made sources include industrial processes, vehicle emissions, power generation, construction activities, and residential heating and cooking.\n\n\t\tThe health impacts of PM1 are of particular concern due to their small size. These tiny particles can penetrate deep into the respiratory system when inhaled, reaching the alveoli of the lungs. PM1 particles can carry various toxic compounds, such as heavy metals, organic pollutants, and harmful chemicals, which can be adsorbed or absorbed onto their surfaces. This can lead to respiratory and cardiovascular problems, exacerbate existing respiratory conditions, and increase the risk of heart attacks, strokes, and other health issues.\n\n\t\tFurthermore, PM1 particles can also contribute to reduced visibility, known as haze or smog, and have environmental effects. They can scatter and absorb sunlight, affecting atmospheric processes and influencing the Earth\'s energy balance. Additionally, the accumulation of PM1 particles in the atmosphere can deposit onto surfaces, leading to soiling and degradation of buildings, monuments, and vegetation.\n\n\t\tGiven the health and environmental concerns associated with PM1, monitoring and controlling particulate matter levels in the air is essential. This includes implementing regulations and measures to reduce emissions from industrial sources, vehicles, and other human activities. Additionally, individuals can take steps to protect themselves by minimizing exposure to high levels of particulate matter, particularly indoors, and by following local air quality advisories and guidelines.',
    'PM 2.5': '\t\tPM2.5 refers to particulate matter with a diameter of 2.5 micrometers or less. Particulate matter, often abbreviated as PM, is a complex mixture of solid particles and liquid droplets suspended in the air. These particles can vary in size, composition, and origin.\n\n\t\tPM2.5 specifically represents the category of particles that are smaller than 2.5 micrometers in diameter. To provide some context, a micrometer (µm) is equal to one-millionth of a meter. PM2.5 particles are smaller than PM10 (particles with a diameter of 10 micrometers or less) and larger than PM1 (particles with a diameter of 1 micrometer or less).\n\n\t\tPM2.5 particles can be directly emitted into the atmosphere, such as through vehicle exhaust, industrial processes, and the burning of fossil fuels. They can also form through complex chemical reactions involving precursor gases such as sulfur dioxide (SO2), nitrogen oxides (NOx), volatile organic compounds (VOCs), and ammonia (NH3).\n\n\t\tDue to their small size, PM2.5 particles can stay suspended in the air for longer periods and can travel longer distances. They can easily penetrate deep into the respiratory system when inhaled, reaching the lungs and potentially entering the bloodstream. These particles can carry a range of toxic substances, including heavy metals, organic pollutants, and combustion by-products, which can pose health risks.\n\n\t\tExposure to elevated levels of PM2.5 is associated with a variety of health effects. Short-term exposure can cause irritation of the eyes, nose, and throat, as well as coughing, sneezing, and shortness of breath. Long-term exposure to high levels of PM2.5 has been linked to respiratory and cardiovascular problems, such as asthma, bronchitis, reduced lung function, heart attacks, strokes, and premature death. Vulnerable populations such as children, the elderly, and individuals with pre-existing respiratory or cardiovascular conditions are particularly at risk.\n\n\t\tPM2.5 particles also contribute to reduced visibility, known as haze or smog. They can scatter and absorb sunlight, leading to atmospheric haze and reduced clarity. Furthermore, the presence of PM2.5 can have environmental effects, including the deposition of particles onto surfaces, soiling and degradation of buildings, monuments, and vegetation, and the alteration of atmospheric processes.\n\n\t\tMonitoring and controlling PM2.5 levels in the air is crucial for protecting human health and the environment. This includes implementing air quality regulations, improving emission controls on industrial sources and vehicles, promoting the use of clean energy sources, and adopting measures to reduce exposure to high levels of particulate matter. Individuals can also take steps to minimize personal exposure, such as staying indoors on days with poor air quality, using air purifiers, and wearing masks designed to filter out PM2.5 particles when necessary.',
    'PM 10': '\t\tPM10 refers to particulate matter with a diameter of 10 micrometers or less. Particulate matter, often abbreviated as PM, is a complex mixture of solid particles and liquid droplets suspended in the air. These particles can vary in size, composition, and origin.\n\n\t\tPM10 specifically represents the category of particles that are smaller than or equal to 10 micrometers in diameter. To provide some context, a micrometer (µm) is equal to one-millionth of a meter. PM10 particles are larger than PM2.5 (particles with a diameter of 2.5 micrometers or less) and PM1 (particles with a diameter of 1 micrometer or less).\n\n\t\tPM10 particles can have various sources, both natural and human-made. Natural sources include dust and soil particles, sea salt particles, pollen, and spores. Human-made sources include emissions from vehicles, industrial processes, construction activities, and the burning of fuels such as coal and wood.\n\n\t\tDue to their size, PM10 particles can remain suspended in the air for a certain period and can be inhaled into the respiratory system. While larger particles tend to get trapped in the nose and throat, smaller particles can reach the lungs. These particles can carry a range of substances, including dust, soot, metals, organic compounds, and other pollutants.\n\n\t\tExposure to elevated levels of PM10 can have health effects. Inhalation of PM10 particles can cause irritation of the respiratory system, leading to symptoms such as coughing, wheezing, shortness of breath, and exacerbation of existing respiratory conditions like asthma and bronchitis. Fine particles can also penetrate deep into the lungs and potentially enter the bloodstream, posing risks to cardiovascular health.\n\n\t\tPM10 particles can also contribute to reduced visibility and haze. They scatter and absorb sunlight, leading to atmospheric haze and decreased clarity. Furthermore, the deposition of PM10 particles onto surfaces can result in soiling, damage to buildings and structures, and impacts on vegetation and ecosystems.\n\n\t\tMonitoring and controlling PM10 levels in the air is essential for protecting human health and the environment. This involves implementing air quality regulations, adopting pollution control measures in various sectors, improving industrial and vehicle emissions standards, and promoting cleaner technologies. Individuals can also take steps to reduce exposure to PM10 by staying indoors on days with high pollution levels, using air purifiers, and wearing masks designed to filter out particulate matter when necessary.\n\n\t\tBy managing and minimizing PM10 pollution, we can mitigate the health risks associated with inhalation of these particles and work towards ensuring cleaner and healthier air for everyone.',
    SO2: '\t\tSulfur dioxide (SO2) is a colorless gas with a pungent odor. It consists of one sulfur atom and two oxygen atoms. SO2 is primarily produced through the combustion of sulfur-containing fossil fuels, such as coal and oil, as well as from industrial processes involving sulfur-containing materials.\n\n\t\tSO2 is a significant air pollutant known for its adverse effects on human health and the environment. It is primarily emitted from the burning of fossil fuels in power plants and industrial facilities, as well as from various industrial processes.\n\n\t\tIn terms of health effects, inhaling sulfur dioxide can lead to respiratory problems. Short-term exposure to high levels of SO2 can cause irritation of the respiratory tract, coughing, and difficulty breathing. Individuals with pre-existing respiratory conditions, such as asthma, may experience worsened symptoms. Long-term exposure to elevated levels of SO2 can contribute to chronic respiratory diseases and reduce lung function.\n\n\t\tSulfur dioxide also has environmental impacts. When released into the atmosphere, it can undergo chemical reactions and transform into other compounds, such as sulfuric acid (H2SO4), which contributes to the formation of acid rain. Acid rain can harm aquatic ecosystems, forests, and soil quality. Additionally, SO2 can react with other pollutants in the atmosphere to form fine particulate matter (PM2.5), which has its own detrimental effects on human health and the environment.\n\n\t\tTo address the issue of sulfur dioxide emissions, many countries have implemented regulations and standards to limit emissions from industrial sources. These regulations often require the use of pollution control technologies, such as flue gas desulfurization systems, which remove sulfur dioxide from exhaust gases before they are released into the atmosphere.\n\n\t\tInternationally, efforts have been made to address SO2 emissions through agreements and protocols. For example, the United Nations Economic Commission for Europe (UNECE) Convention on Long-Range Transboundary Air Pollution and its protocols, such as the Sulphur Protocol, aim to reduce SO2 emissions and combat acid rain on a regional scale.\n\n\t\tReducing sulfur dioxide emissions is crucial for protecting human health and minimizing environmental impacts. This can be achieved through the adoption of cleaner energy sources, such as renewable energy, and the implementation of technologies that effectively reduce sulfur emissions in industrial processes. By taking these measures, we can work towards mitigating the effects of SO2 pollution and creating a healthier and more sustainable environment.',
    NO: '\t\tNO refers to nitric oxide, which is a colorless and odorless gas. It is composed of one nitrogen atom and one oxygen atom. Nitric oxide is a reactive gas that plays important roles in atmospheric chemistry and various biological processes.\n\n\t\tIn the Earth\'s atmosphere, nitric oxide is primarily produced through the combustion of fossil fuels, particularly in vehicles and industrial processes. It is also released through natural processes such as lightning and microbial activities in soils. Additionally, nitric oxide can be formed through the oxidation of nitrogen gas (N2) during high-temperature combustion, such as in internal combustion engines.\n\n\t\tNitric oxide is a precursor to other air pollutants, most notably nitrogen dioxide (NO2) and ozone (O3). When released into the atmosphere, it can undergo reactions with other atmospheric compounds to form nitrogen dioxide. Nitrogen dioxide further reacts with sunlight and volatile organic compounds (VOCs) to form ground-level ozone, a major component of smog.\n\n\t\tIn terms of health effects, exposure to high levels of nitric oxide alone is not considered harmful to humans. However, it can react with other pollutants in the atmosphere to form nitrogen dioxide and ozone, both of which have detrimental impacts on human health. Nitrogen dioxide is a respiratory irritant and can contribute to respiratory problems, particularly in individuals with pre-existing respiratory conditions. Ozone, formed through the reaction of nitric oxide and other pollutants in the presence of sunlight, can also cause respiratory issues and worsen existing respiratory conditions.\n\n\t\tIn addition to its role in air pollution, nitric oxide also plays important physiological roles in the human body. It acts as a signaling molecule and is involved in regulating blood flow, immune response, and nerve cell communication. In medicine, nitric oxide is used as a therapeutic agent to treat certain medical conditions, such as pulmonary hypertension.\n\n\t\tMonitoring and controlling nitric oxide emissions are crucial for managing air quality and reducing the formation of nitrogen dioxide and ozone. This involves implementing emission control technologies in industries and vehicles, promoting cleaner energy sources, and adopting measures to reduce overall pollutant emissions. Additionally, understanding the complex atmospheric chemistry involving nitric oxide is essential for developing effective air pollution mitigation strategies.\n\n\t\tOverall, nitric oxide is a gas with both positive and negative implications. While it plays important physiological roles in the body, its emissions and subsequent reactions in the atmosphere contribute to air pollution and can have harmful effects on human health and the environment.',
    NO2: '\t\tNO2 refers to nitrogen dioxide, which is a reddish-brown gas with a sharp, pungent odor. It is composed of one nitrogen atom and two oxygen atoms. Nitrogen dioxide is an important air pollutant and a major contributor to the formation of smog and poor air quality in urban areas.\n\n\t\tNitrogen dioxide is primarily produced through the combustion of fossil fuels, such as in vehicles, power plants, and industrial processes. It is also formed through the oxidation of nitric oxide (NO) in the presence of oxygen and sunlight. Nitric oxide, released from various sources, undergoes atmospheric reactions to convert into nitrogen dioxide.\n\n\t\tExposure to nitrogen dioxide can have adverse effects on human health. It is a respiratory irritant and can cause inflammation of the airways, leading to respiratory symptoms such as coughing, wheezing, and shortness of breath. Individuals with pre-existing respiratory conditions such as asthma are particularly susceptible to the respiratory effects of nitrogen dioxide. Prolonged or high-level exposure to nitrogen dioxide can contribute to the development of respiratory diseases and reduce lung function.\n\n\t\tNitrogen dioxide is also an important precursor to the formation of ground-level ozone (O3) and other secondary pollutants. In the presence of sunlight and volatile organic compounds (VOCs), nitrogen dioxide can undergo photochemical reactions to produce ozone, a primary component of smog. Ozone can cause respiratory problems, eye irritation, and other health issues, especially during episodes of high concentrations.\n\n\t\tMonitoring and controlling nitrogen dioxide emissions are crucial for managing air quality and reducing the formation of ozone and other secondary pollutants. This involves implementing emission control technologies, such as catalytic converters in vehicles and pollution control measures in industrial processes. Regulations and policies aimed at reducing nitrogen dioxide emissions from various sources play an important role in improving air quality and protecting public health.\n\n\t\tIt is worth noting that nitrogen dioxide concentrations tend to be higher in urban and industrialized areas with heavy traffic and industrial activities. Efforts to reduce nitrogen dioxide emissions can include promoting sustainable transportation options, improving energy efficiency, transitioning to cleaner energy sources, and implementing strategies to reduce overall pollutant emissions.\n\n\t\tBy addressing nitrogen dioxide pollution and implementing measures to reduce its emissions, we can work towards improving air quality and creating healthier environments for communities worldwide.',
    NOx: '\t\tNOx is a term that collectively refers to nitrogen oxides, which are a group of highly reactive gases composed of nitrogen and oxygen. The main components of NOx are nitric oxide (NO) and nitrogen dioxide (NO2), although other nitrogen oxides may also be present in smaller amounts.\n\n\t\tNOx gases are primarily produced through combustion processes, especially in transportation, power generation, and industrial activities. The main contributors to NOx emissions are vehicles, particularly those with internal combustion engines burning fossil fuels such as gasoline or diesel. Industrial processes that involve high-temperature combustion, such as power plants and manufacturing facilities, also release significant amounts of NOx into the atmosphere.\n\n\t\tThe environmental and health impacts of NOx are significant. These gases play a crucial role in the formation of smog and contribute to poor air quality, especially in urban areas with high levels of pollution. Nitrogen dioxide (NO2), one of the major components of NOx, is a reddish-brown gas with a pungent odor and is known to be a respiratory irritant. Exposure to high concentrations of NO2 can lead to respiratory symptoms such as coughing, wheezing, and shortness of breath, particularly in individuals with pre-existing respiratory conditions.\n\n\t\tNOx emissions also contribute to the formation of ground-level ozone (O3), a primary component of smog. In the presence of sunlight and volatile organic compounds (VOCs), NOx reacts with these compounds to form ozone. Ground-level ozone can cause respiratory problems, eye irritation, and other adverse health effects. It also negatively impacts plant health and ecosystems.\n\n\t\tEfforts to reduce NOx emissions focus on implementing various strategies and technologies. These include the use of catalytic converters in vehicles to reduce emissions, employing selective catalytic reduction (SCR) systems in power plants and industrial facilities, adopting cleaner fuels, improving combustion efficiency, and implementing regulations and emission standards.\n\n\t\tReducing NOx emissions is crucial for improving air quality, protecting human health, and mitigating the impacts of smog and ozone pollution. It requires a combination of regulatory actions, technological advancements, and shifts toward cleaner and more sustainable energy and transportation systems. By addressing NOx emissions, we can work towards creating healthier and more sustainable environments for present and future generations.',
    Methane: '\t\tMethane (CH4) is a colorless and odorless gas. It is the primary component of natural gas and is also produced through various natural and human activities. Methane is an important greenhouse gas and has a significant impact on climate change.\n\n\t\tMethane is emitted from both natural and anthropogenic sources. Natural sources include wetlands, rice paddies, termites, and the digestive processes of ruminant animals such as cows. Anthropogenic sources include the production and transport of coal, oil, and natural gas, as well as agricultural activities, such as livestock farming, and the decay of organic waste in landfills.\n\n\t\tMethane is a potent greenhouse gas, meaning it has a high warming potential. In fact, methane has a much stronger warming effect per unit of mass compared to carbon dioxide (CO2), although CO2 remains the primary driver of long-term climate change due to its larger concentrations and longer lifespan in the atmosphere. Nonetheless, methane plays a significant role in the short-term climate forcing and contributes to global warming.\n\n\t\tMethane contributes to global warming by trapping heat in the Earth\'s atmosphere. When released into the atmosphere, methane absorbs infrared radiation, resulting in the greenhouse effect. Over a 20-year timeframe, methane has a warming potential approximately 28-36 times greater than CO2, although this value decreases over longer timeframes.\n\n\t\tMethane emissions can trigger feedback loops that exacerbate climate change. For example, as global temperatures rise, the melting of permafrost can release trapped methane, further contributing to warming. Additionally, as the Arctic sea ice decreases, it may disrupt marine methane stores, potentially leading to additional methane release.\n\n\t\tReducing methane emissions is crucial for mitigating climate change. Strategies to curb methane emissions include improving the management of methane-producing activities, such as better waste management and agricultural practices, reducing fugitive methane emissions from the production and transport of fossil fuels, and capturing methane from landfills and other sources for energy production.\n\n\t\tReducing methane emissions not only helps address climate change but also provides co-benefits such as improved air quality and public health. Methane is a precursor to tropospheric ozone, a pollutant that negatively affects human respiratory health and agricultural productivity.\n\n\t\tEfforts to monitor and reduce methane emissions are critical for achieving global climate goals. International agreements and initiatives, such as the Methane Action Plan launched by the United Nations and other organizations, aim to raise awareness, promote collaboration, and implement strategies to reduce methane emissions across various sectors.\n\n\t\tBy addressing methane emissions, we can make significant strides in mitigating climate change, protecting the environment, and fostering a more sustainable future.',
};

export const ParameterRanges: {[key: string]: AirQualityRangeMap} = {
    CO: COAirQualityRanges,
    CO2: CO2AirQualityRanges,
    O3: OzoneAirQualityRanges,
    PM1: PM1AirQualityRanges,
    'PM 1': PM1AirQualityRanges,
    'PM 2.5': PM2_5AirQualityRanges,
    'PM 10': PM10AirQualityRanges,
    SO2: SO2AirQualityRanges,
    NO: NOAirQualityRanges,
    NO2: NO2AirQualityRanges,
    NOx: NOxAirQualityRanges,
    Methane: MethaneAirQualityRanges,
}

export const ParameterDefaultUnits: {[key: string]: string} = {
    CO: 'PPM',
    CO2: 'PPM',
    O3: 'PPB',
    PM1: 'UGM3',
    'PM 1': 'UGM3',
    'PM 2.5': 'UGM3',
    'PM 10': 'UGM3',
    SO2: 'PPM',
    NO: 'PPB',
    NO2: 'PPB',
    NOx: 'PPB',
    Methane: 'PPM',
    Humidity: '%',
    'Temp(C)': 'C',
    'Temp(F)': 'F',
    Press: 'mbar',
    Battery: '%',
}

type SigFigMap = {
    [key: string]: number;
}

export const ParameterSigFigs: SigFigMap = {
    CO: 2,
    CO2: 1,
    O3: 1,
    PM1: 1,
    'PM 2.5': 1,
    'PM 10': 1,
    SO2: 1,
    NO: 1,
    NO2: 1,
    NOx: 1,
    Methane: 1,
    TEMP: 1,
    PRESS: 1,
    Battery: 2,
    RELHUM: 1,
}

// Returns the color that should be used for the given parameter with the given value. Based on value health ranges
export function getParameterValueColor(parameterName: string, parameterValue: number) {
    const parameterRanges: AirQualityRangeMap = ParameterRanges[parameterName];
    if (parameterRanges == undefined) {
        return 'black';
    }

    if (parameterRanges.Good && (parameterValue >= parameterRanges.Good.min && parameterValue <= parameterRanges.Good.max)) {
        return AirQualityColorCodes.Good;
    } else if (parameterRanges.Moderate && parameterValue <= parameterRanges.Moderate.max) {
        return AirQualityColorCodes.Moderate;
    } else if (parameterRanges["Unhealthy for sensitive groups"] && parameterValue <= parameterRanges["Unhealthy for sensitive groups"].max) {
        return AirQualityColorCodes["Unhealthy for sensitive groups"];
    } else if (parameterRanges.Unhealthy && parameterValue <= parameterRanges.Unhealthy.max) {
        return AirQualityColorCodes.Unhealthy;
    } else if (parameterRanges["Very Unhealthy"] && parameterValue <= parameterRanges["Very Unhealthy"].max) {
        return AirQualityColorCodes["Very unhealthy"];
    } else if (parameterRanges.Hazardous && parameterValue <= parameterRanges.Hazardous.max) {
        return AirQualityColorCodes.Hazardous;
    } else {
        return 'black';
    }
}

export default ParameterDescriptions;