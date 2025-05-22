const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const db = new sqlite3.Database(path.join(__dirname, 'db', 'database.sqlite'));

db.serialize(() => {
    db.run('DROP TABLE IF EXISTS products');
    
    db.run(`CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        short_description TEXT,
        long_description TEXT,
        price REAL NOT NULL,
        image_folder TEXT,
        category TEXT NOT NULL
    )`);

    const insertProduct = db.prepare(`
        INSERT INTO products (name, short_description, long_description, price, image_folder, category) 
        VALUES (?, ?, ?, ?, ?, ?)
    `);

    const products = [
        {
            name: 'Mit Cuipsi den Mengen auf der Spur',
            short_description: 'Lehrwerk für Erzieherinnen in Kitas und Lehrkräfte. Bietet theoretische Einführung und Arbeitsblätter für mathematische Frühförderung. Mit CD für farbige Vorlagen von Spielplänen, Checklisten und Arbeitsblättern.',
            long_description: `'Mit Cuipsi den Mengen auf der Spur' (2. Auflage) richtet sich sowohl an Erzieherinnen in Kindertagesstätten, um ihrem Bildungsauftrag hinsichtlich der vorschulischen mathematischen Frühförderung der Vorschulkinder gerecht werden zu können, als auch an Grund- und SonderschullehrerInnen, um in den Eingangsklassen den pränumerischen Bereich abzudecken. Ebenso können auch Lerntherapeuten mit diesem Material die Pränumerik und damit die Grundlagen der Mathematik erarbeiten. Die in dem Werk dargestellte mathematische Förderung wurde bereits mehrfach erprobt, legt den Schwerpunkt auf handelndes und entdeckendes Lernen und vermittelt mit den eingesetzten Cuisenaire-Stäben ein intuitives mathematisches Operationsverständnis und schafft so optimale Grundlagen für den Start in die Welt der Mathematik. Das Werk bietet neben einer kurzen theoretischen Einführung einen Überblick über den Aufbau der mathematischen Kompetenzen und zum didaktischen Vorgehen in Form von Anweisungskarten mit den passenden (verkleinerten) Arbeitsblättern in verschiedenen Schwierigkeitsgraden, eine Fülle von Spielideen als Spielkartei mit den dazugehörenden Spielplänen. Zusätzlich kann mit Hilfe der Checklisten die individuelle Lernausgangslage bestimmt und der Lernfortschritt dokumentiert werden.

                Das Werk gibt es entweder als Buch mit einem Umfang von 117 Seiten. Zusätzlich liegt eine CD dabei, die pdf-Vorlagen für Spielpläne, Spielkarten, Checklisten und Arbeitsblätter enthält, um diese auch farbig ausdrucken zu können. Die Buchvorlage ist schwarz-weiß. `,
            price: 39.90,
            image_folder: 'book_1/',
            category: 'Buch'
        },
        {
            name: 'Mit Cuipsi die Zahlen bis 20 entdecken',
            short_description: 'Lehrwerk für Grund- und Sonderschulen mit Differenzierungsmaterial für inklusive Klassen. Vermittelt zählfreies Rechnen mit Cuisenaire-Stäben. Enthält Arbeitsblätter, Spiele und CD mit Vorlagen.',
            long_description: `Dieses Buch baut auf dem Werk "Mit Cuipsi den Mengen auf der Spur" auf und richtet sich an LehrerInnen der Eingangsklassen von Grund- und Sonderschulen sowie an Lerntherapeuten, die mit rechenschwachen Kindern arbeiten. Besonders eignet sich das Material für inklusive Klassen, da es eine Vielzahl von Differenzierungsmaterial sowohl für schwächere als auch für stärkere SchülerInnen enthält und so den Ansprüchen eines zieldifferenten Unterrichts gerecht wird. Diese geschieht mit den Cuisenaire-Stäben, mit denen Kinder problemlos ohne Zählen Rechnen lernen, das Teile-Ganze-Konzept verinnerlichen und damit tatsächlich Mathematik begreifen können. Das Werk bietet neben einer kurzen theoretischen Einführung, die Beschreibung des didaktischen Vorgehens (so werden z.B. die verschiedenen Möglichkeiten des Zehnerübergangs genau beschrieben und jeder Schüler kann so für sich die passende Möglichkeit finden) anhand der erprobten Form der Anweisungskarten. Daneben gibt es eine Fülle von Arbeitsblättern und neu hinzugekommene Freiarbeitskarten und 'Bonbon-Arbeitsblätter', die als Hausaufgaben eingesetzt werden können. Natürlich gibt es wieder eine Fülle von Spielideen mit den dazugehörenden Spielkarten und Spielplänen. Zusätzlich kann mit Hilfe der Checklisten die individuelle Lernausgangslage bestimmt und der Lernfortschritt dokumentiert werden. Auf der beiliegenden CD finden sich die farbigen Materialien zum Selbstausdrucken. Die Buchvorlage ist schwarz-weiß.`,
            price: 54.90,
            image_folder: 'book_2/',
            category: 'Buch'
        },
        {
            name: 'Mit Cuipsi den Zahlenraum 100 erforschen',
            short_description: 'Lehrwerk zum ZR 100 für Grund- und Sonderschullehrer. Für inklusive Klassen mit Differenzierungsmaterial. Die Cuipsi-Platten fördern zählfreies Rechnen. Inklusive CD mit Druckvorlagen.',
            long_description: `Dieses Werk baut auf dem Material 'Mit Cuipsi die Zahlen bis 20 entdecken" auf und richtet sich an GrundschullehrerInnen von 2. Klassen und an SonderschullehrerInnen, die den ZR 100  erarbeiten wollen, sowie an Lerntherapeuten, die mit rechenschwachen Kindern arbeiten. Besonders eignet sich das Material für inklusive Klassen, da es eine Vielzahl von Differenzierungsmaterial sowohl für schwächere als auch für stärkere SchülerInnen enthält und so den Ansprüchen eines zieldifferenten Unterrichts gerecht wird. Durch die neu entwickelten Cuipsi-Platten erweitert die SchülerInnen ihre Kenntnisse im ZR 100 und lernen mit den Stäben Aufgaben analog zum ZR 20 mit den Cuipsi-Platten handelnd zu lösen und ein Zählen zu vermeiden. 
                Auf der beiliegenden CD finden sich die farbigen Materialien zum Selbstausdrucken. Die Buchvorlage ist schwarz-weiß. `,
            price: 39.90,
            image_folder: 'book_3/',
            category: 'Buch'
        },
        {
            name: 'Mit Cuipsi den Zahlenraum 1000 erkunden',
            short_description: 'Vierter Teil der Reihe für ZR 1000. Für Grund- und Sonderschullehrer mit differenziertem Material für inklusive Klassen. Die Cuipsi-Quader ermöglichen handelndes Lernen. Mit CD für Druckvorlagen.',
            long_description: `Dies ist Teil 4 des Werkes "Mathe durchdringen" und behandelt den Zahlenraum bis 1000. Es baut auf den vorangehenden Werken auf und richtet sich an GrundschullehrerInnen von 3. Klassen und an SonderschullehrerInne, die den Zahlenraum 1000 erarbeiten wollen, sowie an Lerntherapeuten, die mit rechenschwachen Kindern arbeiten.

                Auch dieses Buch eignet sich besonders für inklusive Klassen, da es ein eher kleinschrittiges Vorgehen für schwächere SchülerInnen und ein schnelleres Vorgehen für stärkere SchülerInnen ermöglicht und viel Differenzierungsmaterial enthält.

                Durch die neu entwickelten Cuipsi-Quader erweitern die SchülerInnen ihre bisher erworbenen Kenntnisse und können weiter alle Aufgaben handelnd lösen, wenn ihnen der abstrakte Umgang mit Zahlen schwer fällt.

                Auf der beiliegenden CD finden sich die farbigen Materialien zum Selbstausdrucken. Die Buchvorlage ist schwarz-weiß.`,
            price: 39.90,
            image_folder: 'book_4/',
            category: 'Buch'
        },
        {
            name: 'Arbeitsheft zur Pränumerik mit Ziffernschreiblehrgang',
            short_description: 'Ringbuch mit Arbeitsblättern zum Buch "Mit Cuipsi den Mengen auf der Spur". Als Wendebuch mit Ziffernschreiblehrgang konzipiert. Ermöglicht individuelles Lerntempo. 71 Seiten.',
            long_description: `Das Arbeitsheft zur Pränumerik beinhaltet alle Arbeitsblätter für die Schülerhand, die im Buch "Mit Cuipsi den Mengen auf der Spur" erläutert werden. Zusätzlich gibt es weitere Arbeitsblätter, die je nach Bedarf eingesetzt werden können.

                Daneben eignet es sich dafür, die Schüler im Umgang mit einem Heft anzuleiten. Auch hier haben die Autorinnen die Ringbuchform gewählt, damit die Schüler problemlos die Stäbe auf die Vorlagen legen können. Erleichtert wird dadurch auch das individuelle Voranschreiten des Lernstoffes. Die Lehrkraft behält zudem auf einfache Art und Weise den Überblick über den Stand der einzelnen Schüler.

                Da dieses Ringbuch als Wendebuch konzipiert ist, kann parallel die Schreibweise der Ziffern geübt werden.

 

                Der Umfang beträgt 71 Seiten.`,
            price: 8.95,
            image_folder: 'workbook_1/',
            category: 'Arbeitsheft'
        },
        {
            name: 'Arbeitsheft Zahlenraum 20',
            short_description: 'Spiralgebundenes Arbeitsheft für ZR 20 mit 161 Seiten. Für differenzierenden Einsatz in Grund- und Förderschulen. Ermöglicht individuelles Lerntempo mit Förderniveau für leistungsstärkere Schüler.',
            long_description: `Das Arbeitsheft für den ZR -20 enthält alle nötigen Schritte, um den ZR - 20 fundiert aufzubauen.
                Das Arbeitsheft mit praktischer Spiralbindung ist für den differenzierenden Einsatz in der Grundschule geeignet und damit auch für den Einsatz in der Förderschule. Für den Einsatz in der Förderschule gibt es weitere Informationen bei den Autorinnen. 
                Darüber hinaus enthält das Grundschul-Arbeitsheft auch Seiten mit Forderniveau, so dass leistungsstärkere Schüler hier einen Lernanzreiz finden.

                Durch den Einsatz des Arbeitsheftes ist ein individuelles Voranschreiten jedes einzelnen Schülers möglich. 

                Staffelpreise bei Bestellung für eine ganze Schulklasse möglich. 

 

                Der Umfang beträgt 161 Seiten.`,
            price: 24.95,
            image_folder: 'workbook_2/',
            category: 'Arbeitsheft'
        },
        {
            name: 'Arbeitsheft Zahlenraum 100',
            short_description: 'Spiralgebundenes Arbeitsheft (88 Seiten) für ZR 100. Bietet differenzierte Arbeitsblätter für verschiedene Lerntempos. Schüler erkunden den Zahlenraum mit Cuipsi-Platten und kombinieren mit anderen Übungsformen.',
            long_description: `Dieses Arbeitsheft mit praktischer Spiralbindung enthält alle Arbeitsblätter für den Zahlenraum 100.

                Auch hier können die Schüler wieder ihrem individuellem Lerntempo folgen und den Zahlenraum 100 handelnd mit den Cuipsi-Platten erforschen. Es enthält differenzierende Arbeitsblätter sowohl für langsamere als auch für schnellere Lernende. Zudem kann das Material problemlos mit anderen Übungsformen kombiniert werden.


                Der Umfang beträgt 88 Seiten.`,
            price: 10.95,
            image_folder: 'workbook_3/',
            category: 'Arbeitsheft'
        },
        {
            name: 'Arbeitsheft Zahlenraum 1000',
            short_description: 'Spiralgebundenes Arbeitsheft (143 Seiten, 53 in Farbe) für ZR 1000. Bietet differenzierte Arbeitsblätter für verschiedene Lerntempos. Zum handelnden Erkunden mit Cuipsi-Quadern konzipiert.',
            long_description: `Dieses Arbeitsheft mit praktischer Spiralbindung enthält alle Arbeitsblätter für den Zahlenraum 1000.

                Auch hier können die Schüler wieder ihrem individuellem Lerntempo folgen und den Zahlenraum 1000 handelnd mit den Cuipsi-Quadern erkunden Es enthält differenzierende Arbeitsblätter sowohl für langsamere als auch für schnellere Lernende. Zudem kann das Material problemlos mit anderen Übungsformen kombiniert werden.

 

                Der Umfang beträgt 143 Seiten, davon 53 in Farbe.`,
            price: 26.00,
            image_folder: 'workbook_4/',
            category: 'Arbeitsheft'
        },
        {
            name: 'Cuipsi für Quereinsteiger - Das Selbstlernheft',
            short_description: 'Selbstlernheft für SchülerInnen ab 3. Klasse und Lerntherapie. Festigt mathematische Grundlagen und bietet Alternativen zu Zählstrategien. Mit vier Lernfortschritts-Checks. 104 Seiten (55 in Farbe).',
            long_description: `Das Arbeitsheft "Cuipsi für Quereinsteiger" ist als Selbstlernheft konzipiert und für SchüllerInnen ab der 3. Klasse und zum Einsatz in der Lerntherapie geeignet. Im ersten Teil der Pränumerik werden die mathematischen Grundlagen gefestigt und die mathematischen Operationen eng an Handlungen gebunden, um bei den SchülerInnen eine Alternative zu reinen Zählstrategien aufzubauen. Im zweiten Teil wird der Zahlenraum bis 20 grundlegend neu erarbeitet.
                Für die Lehrkraft gibt es insgesamt vier Checks, anhand derer der Lernfortschritt der SchülerInnen kontrolliert werden kann.

 

                Der Umfang beträgt 104 Seiten, davon 55 in Farbe.`,
            price: 25.00,
            image_folder: 'workbook_5/',
            category: 'Arbeitsheft'
        },
        {
            name: 'Cuipsi Platten Set',
            short_description: 'Holz-Plattenset für ZR 100. Fördert zählfreies Rechnen durch visuelle Zahlendarstellung. Enthält 3x 20er-Platten, je 2x 30er-90er-Platten und eine 100er-Platte. Mit Aufbewahrungsbox.',
            long_description: `ie Cuispi-Platten aus Holz wurden neu entwickelt und erleichtern das operative Handeln im Zahlenraum bis 100. 
                Sie wirken dem Zählen entgegen. Gemeinsam mit den Stäben ist eine schnelle und auf einen Blick erkennbare Zahldarstellung möglich.
                Ein Satz enthält 3x die 20er-Platte und je 2x die 30er-, 40er-, 50er-, 60er-, 70er-, 80er-, 90er-Platte und eine 100er-Platte, Die Cuipsi-Platten werden zusammen mit einer praktischen Aufbewahrungsbox geliefert.

                Bestellen Sie mindestens 8 Schülersätze, so gibt es als Bonus praktische Vorlagen dazu, mit denen das passende Tafelmaterial einfach selbst hergestellt werden kann.`,
            price: 27.80,
            image_folder: 'workmaterial_1/',
            category: 'Arbeitsmaterial'
        },
        {
            name: 'Cuipsi-Quader - Komplettpaket',
            short_description: 'Quader-Set für ZR 1000 aus biologisch abbaubarem Kunststoff. Je zwei 200er-500er und je einen 600er-900er Quader. Mit Vorlagen für Tafelmaterial und Bastelbögen für Schüler.',
            long_description: `Das Cuipsi-Quader-Komplettpaket enthält  je zwei 200er-, 300er-, 400er- und 500er-Cuipsi-Quader und je einen 600er-, 700er-, 800er- und 900er-Cuipsi-Quader. Zusätzlich sind Vorlagen für das passende Tafelmaterial sowie Cuipsi-Quader-Bastelvorlagen für die Schülerhand enthalten.

                Die neu entwickelten Cuipsi-Quader werden als EInzelstücke angefertigt. Sie sind aus einem biologisch abbaubaren Kunststoff.
                Aufgrund der langen Herstellungsdauer ist die Lieferzeit entsprechend länger. 
                Sie dienen der Lehrkraft als Anschauungsmittel im Zahlenraum bis 1000 und helfen bei der Erarbeitung und Sicherung des Stellenwerts gemeinsam mit den Cuisenaire-Stäben und den Cuipsi-Platten.

                Zusätzlich enthält dieses Paket Vorlagen für das Cuipsi-Quader Tafelmaterial. Dazu können sie vergrößert auf farbiges Tonpapier gedruckt, laminiert und mit einem Magnetstreifen versehen werden. So hat die Lehrkraft ein Anschauungsmaterial für die Tafel, um einzelne Rechenschritte zu erklären oder um mit einzelnen Schüler an der Tafel zu arbeiten.

                Des weiteren enthält es eine Bastelvorlage, mit der die Schüler sich selbst Cuipsi-Quader basteln können.`,
            price: 69.95,
            image_folder: 'workmaterial_2/',
            category: 'Arbeitsmaterial'
        }
    ];

    products.forEach(product => {
        insertProduct.run(
            product.name,
            product.short_description,
            product.long_description,
            product.price,
            product.image_folder,
            product.category
        );
    });

    insertProduct.finalize();
    console.log('Database initialized with sample data.');
});

db.close();